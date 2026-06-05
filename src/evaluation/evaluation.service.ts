import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { Contratista } from '../contractor/entities/contractor.entity';

@Injectable()
export class EvaluationService {
    constructor(
        @InjectRepository(Evaluation)
        private readonly evaluationRepository: Repository<Evaluation>,
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
            const searchFields = ['responsable', 'observaciones', 'rangoPeriodo', 'company'];
            where = searchFields.map(field => {
                const condition: any = { ...where };
                condition[field] = ILike(`%${global}%`);
                return condition;
            });
        }

        const [docs, totalData] = await this.evaluationRepository.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            skip,
            take,
            relations: ['contrato', 'contratista', 'periodo'],
            order: { fechaCreacion: 'DESC' } as any,
        });

        return {
            message: 'Evaluations paginated successfully',
            data: docs,
            meta: {
                totalData: totalData,
            },
        };
    }

    async create(createDto: CreateEvaluationDto) {
        const evaluation: Evaluation = this.evaluationRepository.create({
            ...createDto,
            porcentajeEvaluado: Number(createDto.porcentajeEvaluado) || 0,
            valorPeriodo: Number(createDto.valorPeriodo) || 0,
        });
        const saved: Evaluation = await this.evaluationRepository.save(evaluation);

        // BR-19: Enviar correo automático de calificación al contratista
        const contractor = await this.dataSource.getRepository(Contratista).findOne({
            where: { id: saved.contratistaId }
        });

        return {
            message: 'Evaluation created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.evaluationRepository.find({
            relations: ['contrato', 'contratista', 'periodo'],
        });
        return {
            message: 'Evaluations found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findByContract(contratoId: string) {
        const data = await this.evaluationRepository.find({
            where: { contratoId },
            relations: ['contratista', 'periodo'],
        });
        return {
            message: 'Evaluations found for contract',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const evaluation = await this.evaluationRepository.findOne({
            where: { id },
            relations: ['contrato', 'contratista', 'periodo'],
        });
        if (!evaluation) {
            throw new NotFoundException(`Evaluation with ID ${id} not found`);
        }
        return {
            message: 'Evaluation found',
            data: evaluation,
        };
    }

    async update(id: string, updateDto: UpdateEvaluationDto) {
        const preloaded = await this.evaluationRepository.preload({
            id,
            ...updateDto,
            porcentajeEvaluado: updateDto.porcentajeEvaluado !== undefined ? Number(updateDto.porcentajeEvaluado) : undefined,
            valorPeriodo: updateDto.valorPeriodo !== undefined ? Number(updateDto.valorPeriodo) : undefined,
        });

        if (!preloaded) {
            throw new NotFoundException(`Evaluation with ID ${id} not found`);
        }
        const updated: Evaluation = await this.evaluationRepository.save(preloaded);

        // BR-19: Enviar correo de actualización de calificación
        const contractor = await this.dataSource.getRepository(Contratista).findOne({
            where: { id: updated.contratistaId }
        });
        return {
            message: 'Evaluation updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const evaluation = await this.findOne(id);
        await this.evaluationRepository.remove(evaluation.data);
        return {
            message: 'Evaluation deleted successfully',
            data: null,
        };
    }
}
