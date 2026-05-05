import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractorChecklist } from './entities/contractor-checklist.entity';
import { CreateContractorChecklistDto } from './dto/create-contractor-checklist.dto';
import { UpdateContractorChecklistDto } from './dto/update-contractor-checklist.dto';

@Injectable()
export class ContractorChecklistService {
    constructor(
        @InjectRepository(ContractorChecklist)
        private readonly checklistRepository: Repository<ContractorChecklist>,
    ) {}

    async create(createDto: CreateContractorChecklistDto): Promise<ContractorChecklist> {
        const checklist = this.checklistRepository.create(createDto);
        return await this.checklistRepository.save(checklist);
    }

    async findAll(): Promise<ContractorChecklist[]> {
        return await this.checklistRepository.find({
            relations: ['contratista'],
        });
    }

    async findOne(id: string): Promise<ContractorChecklist> {
        const checklist = await this.checklistRepository.findOne({
            where: { id },
            relations: ['contratista'],
        });
        if (!checklist) {
            throw new NotFoundException(`Lista de chequeo con ID ${id} no encontrada`);
        }
        return checklist;
    }

    async update(id: string, updateDto: UpdateContractorChecklistDto): Promise<ContractorChecklist> {
        const checklist = await this.findOne(id);
        const updated = Object.assign(checklist, updateDto);
        return await this.checklistRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const checklist = await this.findOne(id);
        await this.checklistRepository.remove(checklist);
    }
}
