import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contratista } from '../contractor/entities/contractor.entity';
import { Period } from '../period/entities/period.entity';

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        private readonly dataSource: DataSource,
    ) {}

    async findByPage(
        user: any,
        from: number = 0,
        limit: number = 10,
        global?: string,
    ) {
        const skip = from;
        const take = limit;

        let where: any = {};

        if (global) {
            const searchFields = ['numeroContrato', 'documentoContratista', 'nombreReferente', 'responsableSupervisor', 'company'];
            where = searchFields.map(field => {
                const condition: any = { ...where };
                condition[field] = ILike(`%${global}%`);
                return condition;
            });
        }

        const [docs, totalData] = await this.contractRepository.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            skip,
            take,
            relations: ['contratista'],
            order: { fechaCreacion: 'DESC' } as any,
        });

        return {
            message: 'Contracts paginated successfully',
            data: docs,
            meta: {
                totalData: totalData,
            },
        };
    }

    async create(createDto: CreateContractDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Validar que el contratista exista y esté activo (BR-21)
            const contractorRepo = queryRunner.manager.getRepository(Contratista);
            const contractor = await contractorRepo.findOne({ where: { id: createDto.contratistaId.toString() } });
            if (!contractor) {
                throw new NotFoundException(`Contractor with ID ${createDto.contratistaId} not found`);
            }
            if (contractor.estado !== 'activo') {
                throw new BadRequestException(`El contratista asociado no está activo (Estado actual: ${contractor.estado})`);
            }

            // 2. Validar restricción de contrato vigente único (BR-22)
            if (createDto.vigente !== false) {
                const activeContract = await queryRunner.manager.findOne(Contract, {
                    where: { contratistaId: contractor.id, vigente: true }
                });
                if (activeContract) {
                    throw new BadRequestException('El contratista ya posee un contrato activo y vigente. Cierre el contrato actual antes de iniciar uno nuevo.');
                }
            }

            // 3. Crear instancia de Contrato asignando tipos numéricos reales
            const contractInstance = queryRunner.manager.create(Contract, {
                ...createDto,
                anio: createDto.ano, // Mapear año del DTO a anio en Entity
                contratistaId: contractor.id,
                porcentajeTotal: Number(createDto.porcentajeTotal) || 0,
                porcentajeRestante: Number(createDto.porcentajeRestante) || 100,
                valorTotalContrato: Number(createDto.valorTotalContrato) || 0,
                numeroPeriodo: Number(createDto.numeroPeriodo) || 1,
                valorParaPeriodos: Number(createDto.valorParaPeriodos) || 0,
            });

            const savedContract = await queryRunner.manager.save(Contract, contractInstance);

            // 4. Actualizar flag del contratista
            if (savedContract.vigente) {
                contractor.contratoVigente = true;
                await queryRunner.manager.save(Contratista, contractor);
            }

            // 5. Autogenerar y distribuir los periodos financieros (BR-09, BR-23, BR-24)
            const numPeriodos = Number(createDto.numeroPeriodo) || 1;
            const valorTotalPeriodos = Number(createDto.valorParaPeriodos) || 0;

            if (numPeriodos > 0 && valorTotalPeriodos > 0 && createDto.periodoInicio && createDto.periodoFin) {
                const start = new Date(createDto.periodoInicio);
                const end = new Date(createDto.periodoFin);
                
                if (start > end) {
                    throw new BadRequestException('La fecha de inicio no puede ser posterior a la fecha de finalización');
                }

                const periodosToCreate: Period[] = [];
                const valorBasePeriodo = Math.floor((valorTotalPeriodos / numPeriodos) * 100) / 100;
                let valorAcumulado = 0;

                const totalMs = end.getTime() - start.getTime();
                const msPerPeriod = Math.floor(totalMs / numPeriodos);

                for (let i = 0; i < numPeriodos; i++) {
                    // Balance presupuestal exacto al centavo (BR-24)
                    let valorPeriodo = valorBasePeriodo;
                    if (i === numPeriodos - 1) {
                        valorPeriodo = Math.round((valorTotalPeriodos - valorAcumulado) * 100) / 100;
                    } else {
                        valorAcumulado += valorBasePeriodo;
                    }

                    // Distribución equitativa y exacta de fechas (BR-23)
                    const fechaIniPeriodo = new Date(start.getTime() + i * msPerPeriod);
                    let fechaFinPeriodo = new Date(start.getTime() + (i + 1) * msPerPeriod - (24 * 60 * 60 * 1000));
                    
                    if (i === numPeriodos - 1) {
                        fechaFinPeriodo = end;
                    }

                    const isoIni = fechaIniPeriodo.toISOString().split('T')[0];
                    const isoFin = fechaFinPeriodo.toISOString().split('T')[0];

                    const periodInstance = queryRunner.manager.create(Period, {
                        contratoId: savedContract.id,
                        contratistaId: contractor.id,
                        fechaInicial: isoIni,
                        fechaFinal: isoFin,
                        numeroPeriodo: (i + 1).toString(),
                        valor: valorPeriodo,
                        company: savedContract.company,
                        tenantId: savedContract.tenantId,
                    });

                    periodosToCreate.push(periodInstance);
                }

                await queryRunner.manager.save(Period, periodosToCreate);
            }

            await queryRunner.commitTransaction();

            return {
                message: 'Contract and periods created successfully',
                data: savedContract,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll() {
        const data = await this.contractRepository.find({
            relations: ['contratista', 'tareas', 'periodos', 'objetivos', 'soportes'],
        });
        return {
            message: 'Contracts found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: ['contratista', 'tareas', 'periodos', 'objetivos', 'soportes'],
        });
        if (!contract) {
            throw new NotFoundException(`Contract with ID ${id} not found`);
        }
        return {
            message: 'Contract found',
            data: contract,
        };
    }

    async findByNumber(numeroContrato: string) {
        const contract = await this.contractRepository.findOne({
            where: { numeroContrato },
            relations: ['contratista', 'tareas', 'periodos', 'objetivos', 'soportes'],
        });
        if (!contract) {
            throw new NotFoundException(`Contract number ${numeroContrato} not found`);
        }
        return {
            message: 'Contract found',
            data: contract,
        };
    }

    async update(id: string, updateDto: UpdateContractDto) {
        const contract = await this.contractRepository.preload({
            id,
            ...updateDto,
            anio: updateDto.ano, // Mapear año del DTO
            porcentajeTotal: updateDto.porcentajeTotal !== undefined ? Number(updateDto.porcentajeTotal) : undefined,
            porcentajeRestante: updateDto.porcentajeRestante !== undefined ? Number(updateDto.porcentajeRestante) : undefined,
            valorTotalContrato: updateDto.valorTotalContrato !== undefined ? Number(updateDto.valorTotalContrato) : undefined,
            numeroPeriodo: updateDto.numeroPeriodo !== undefined ? Number(updateDto.numeroPeriodo) : undefined,
            valorParaPeriodos: updateDto.valorParaPeriodos !== undefined ? Number(updateDto.valorParaPeriodos) : undefined,
        });

        if (!contract) {
            throw new NotFoundException(`Contract with ID ${id} not found`);
        }
        const updated = await this.contractRepository.save(contract);
        return {
            message: 'Contract updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract.data);
        return {
            message: 'Contract deleted successfully',
            data: null,
        };
    }
}
