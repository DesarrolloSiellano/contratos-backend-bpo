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

    async create(createDto: CreateEvaluationDto): Promise<Evaluation> {
        const evaluation = this.evaluationRepository.create(createDto);
        return await this.evaluationRepository.save(evaluation);
    }

    async findAll(): Promise<Evaluation[]> {
        return await this.evaluationRepository.find({
            relations: ['contrato', 'contratista'],
        });
    }

    async findByContract(contratoId: string): Promise<Evaluation[]> {
        return await this.evaluationRepository.find({
            where: { contratoId },
            relations: ['contratista'],
        });
    }

    async findOne(id: string): Promise<Evaluation> {
        const evaluation = await this.evaluationRepository.findOne({
            where: { id },
            relations: ['contrato', 'contratista'],
        });
        if (!evaluation) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }
        return evaluation;
    }

    async update(id: string, updateDto: UpdateEvaluationDto): Promise<Evaluation> {
        const evaluation = await this.findOne(id);
        const updated = Object.assign(evaluation, updateDto);
        return await this.evaluationRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const evaluation = await this.findOne(id);
        await this.evaluationRepository.remove(evaluation);
    }
}
