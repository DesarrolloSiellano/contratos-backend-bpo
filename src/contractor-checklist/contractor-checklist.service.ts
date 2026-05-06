import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ContractorChecklist } from './entities/contractor-checklist.entity';
import { CreateContractorChecklistDto } from './dto/create-contractor-checklist.dto';
import { UpdateContractorChecklistDto } from './dto/update-contractor-checklist.dto';

@Injectable()
export class ContractorChecklistService {
    constructor(
        @InjectRepository(ContractorChecklist)
        private readonly checklistRepository: Repository<ContractorChecklist>,
    ) {}

    async findByPage(
        user: any,
        from: number = 0,
        limit: number = 10,
        global?: string,
    ) {
        const { isSuperAdmin, company } = user;
        const skip = from;
        const take = limit;

        let where: any = {};

        if (!isSuperAdmin) {
            where.company = company;
        }

        if (global) {
            const searchFields = ['liderProceso', 'ocupacion', 'telefono', 'company'];
            where = searchFields.map(field => {
                const condition: any = { ...where };
                condition[field] = ILike(`%${global}%`);
                return condition;
            });
        }

        const [docs, totalData] = await this.checklistRepository.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            skip,
            take,
            relations: ['contratista'],
            order: { fechaCreacion: 'DESC' } as any,
        });

        return {
            message: 'Checklists paginated successfully',
            data: docs,
            meta: {
                totalData: totalData,
            },
        };
    }

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
