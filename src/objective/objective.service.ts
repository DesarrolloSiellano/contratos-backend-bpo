import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Objective } from './entities/objective.entity';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@Injectable()
export class ObjectiveService {
    constructor(
        @InjectRepository(Objective)
        private readonly objectiveRepository: Repository<Objective>,
    ) {}

    async create(createDto: CreateObjectiveDto) {
        const objective = this.objectiveRepository.create(createDto);
        const saved = await this.objectiveRepository.save(objective);
        return {
            message: 'Objective created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.objectiveRepository.find({
            relations: ['contrato', 'soportes'],
        });
        return {
            message: 'Objectives found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findByContract(contratoId: string) {
        const data = await this.objectiveRepository.find({
            where: { contratoId },
            relations: ['soportes'],
        });
        return {
            message: 'Objectives found for contract',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const objective = await this.objectiveRepository.findOne({
            where: { id },
            relations: ['contrato', 'soportes'],
        });
        if (!objective) {
            throw new NotFoundException(`Objective with ID ${id} not found`);
        }
        return {
            message: 'Objective found',
            data: objective,
        };
    }

    async update(id: string, updateDto: UpdateObjectiveDto) {
        const objective = await this.objectiveRepository.preload({
            id,
            ...updateDto,
        });
        if (!objective) {
            throw new NotFoundException(`Objective with ID ${id} not found`);
        }
        const updated = await this.objectiveRepository.save(objective);
        return {
            message: 'Objective updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const objective = await this.findOne(id);
        await this.objectiveRepository.remove(objective.data);
        return {
            message: 'Objective deleted successfully',
            data: null,
        };
    }
}
