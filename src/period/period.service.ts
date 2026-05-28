import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Period } from './entities/period.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Injectable()
export class PeriodService {
    constructor(
        @InjectRepository(Period)
        private readonly periodRepository: Repository<Period>,
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
            const searchFields = ['numeroPeriodo', 'company'];
            where = searchFields.map(field => {
                const condition: any = { ...where };
                condition[field] = ILike(`%${global}%`);
                return condition;
            });
        }

        const [docs, totalData] = await this.periodRepository.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            skip,
            take,
            relations: ['contrato', 'contratista', 'evaluation', 'soportes'],
            order: { fechaCreacion: 'DESC' } as any,
        });

        return {
            message: 'Periods paginated successfully',
            data: docs,
            meta: {
                totalData: totalData,
            },
        };
    }

    async create(createDto: CreatePeriodDto) {
        const period = this.periodRepository.create({
            ...createDto,
            valor: createDto.valor ? Number(createDto.valor) : undefined,
        });
        const saved = await this.periodRepository.save(period);
        return {
            message: 'Period created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.periodRepository.find({
            relations: ['contrato', 'contratista', 'evaluation', 'soportes'],
        });
        return {
            message: 'Periods found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findByContract(contratoId: string) {
        const data = await this.periodRepository.find({
            where: { contratoId },
            relations: ['evaluation', 'soportes'],
            order: { numeroPeriodo: 'ASC' },
        });
        return {
            message: 'Periods found for contract',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const period = await this.periodRepository.findOne({
            where: { id },
            relations: ['contrato', 'contratista', 'evaluation', 'soportes'],
        });
        if (!period) {
            throw new NotFoundException(`Period with ID ${id} not found`);
        }
        return {
            message: 'Period found',
            data: period,
        };
    }

    async update(id: string, updateDto: UpdatePeriodDto) {
        const period = await this.periodRepository.preload({
            id,
            ...updateDto,
            valor: updateDto.valor !== undefined ? Number(updateDto.valor) : undefined,
        });
        if (!period) {
            throw new NotFoundException(`Period with ID ${id} not found`);
        }
        const updated = await this.periodRepository.save(period);
        return {
            message: 'Period updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const period = await this.findOne(id);
        await this.periodRepository.remove(period.data);
        return {
            message: 'Period deleted successfully',
            data: null,
        };
    }
}
