import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Injectable()
export class PeriodService {
    constructor(
        @InjectRepository(Period)
        private readonly periodRepository: Repository<Period>,
    ) {}

    async create(createDto: CreatePeriodDto): Promise<Period> {
        const period = this.periodRepository.create(createDto);
        return await this.periodRepository.save(period);
    }

    async findAll(): Promise<Period[]> {
        return await this.periodRepository.find({
            relations: ['contrato', 'contratista', 'evaluation'],
        });
    }

    async findByContract(contratoId: string): Promise<Period[]> {
        return await this.periodRepository.find({
            where: { contratoId },
            relations: ['evaluation'],
            order: { numeroPeriodo: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Period> {
        const period = await this.periodRepository.findOne({
            where: { id },
            relations: ['contrato', 'contratista', 'evaluation'],
        });
        if (!period) {
            throw new NotFoundException(`Periodo con ID ${id} no encontrado`);
        }
        return period;
    }

    async update(id: string, updateDto: UpdatePeriodDto): Promise<Period> {
        const period = await this.findOne(id);
        const updated = Object.assign(period, updateDto);
        return await this.periodRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const period = await this.findOne(id);
        await this.periodRepository.remove(period);
    }
}
