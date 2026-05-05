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

    async create(createDto: CreateObjectiveDto): Promise<Objective> {
        const objective = this.objectiveRepository.create(createDto);
        return await this.objectiveRepository.save(objective);
    }

    async findAll(): Promise<Objective[]> {
        return await this.objectiveRepository.find({
            relations: ['contrato'],
        });
    }

    async findByContract(contratoId: string): Promise<Objective[]> {
        return await this.objectiveRepository.find({
            where: { contratoId },
        });
    }

    async findOne(id: string): Promise<Objective> {
        const objective = await this.objectiveRepository.findOne({
            where: { id },
            relations: ['contrato'],
        });
        if (!objective) {
            throw new NotFoundException(`Objetivo con ID ${id} no encontrado`);
        }
        return objective;
    }

    async update(id: string, updateDto: UpdateObjectiveDto): Promise<Objective> {
        const objective = await this.findOne(id);
        const updated = Object.assign(objective, updateDto);
        return await this.objectiveRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const objective = await this.findOne(id);
        await this.objectiveRepository.remove(objective);
    }
}
