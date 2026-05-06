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

    async create(createDto: CreateContractorChecklistDto) {
        const checklist = this.checklistRepository.create(createDto);
        const saved = await this.checklistRepository.save(checklist);
        return {
            message: 'Checklist created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.checklistRepository.find({
            relations: ['contratista'],
        });
        return {
            message: 'Checklists found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const checklist = await this.checklistRepository.findOne({
            where: { id },
            relations: ['contratista'],
        });
        if (!checklist) {
            throw new NotFoundException(`Checklist with ID ${id} not found`);
        }
        return {
            message: 'Checklist found',
            data: checklist,
        };
    }

    async update(id: string, updateDto: UpdateContractorChecklistDto) {
        const checklist = await this.checklistRepository.preload({
            id,
            ...updateDto,
        });
        if (!checklist) {
            throw new NotFoundException(`Checklist with ID ${id} not found`);
        }
        const updated = await this.checklistRepository.save(checklist);
        return {
            message: 'Checklist updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const checklist = await this.findOne(id);
        await this.checklistRepository.remove(checklist.data);
        return {
            message: 'Checklist deleted successfully',
            data: null,
        };
    }
}
