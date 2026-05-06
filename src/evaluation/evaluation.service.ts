import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
    constructor(
        @InjectRepository(Evaluation)
        private readonly evaluationRepository: Repository<Evaluation>,
    ) {}

    async create(createDto: CreateEvaluationDto) {
        const evaluation = this.evaluationRepository.create(createDto);
        const saved = await this.evaluationRepository.save(evaluation);
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
        const evaluation = await this.evaluationRepository.preload({
            id,
            ...updateDto,
        });
        if (!evaluation) {
            throw new NotFoundException(`Evaluation with ID ${id} not found`);
        }
        const updated = await this.evaluationRepository.save(evaluation);
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
