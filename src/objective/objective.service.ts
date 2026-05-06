import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Objective } from './entities/objective.entity';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@Injectable()
export class ObjectiveService {
    constructor(
        @InjectRepository(Objective)
        private readonly objectiveRepository: Repository<Objective>,
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
            const searchFields = ['objetivo', 'producto', 'company'];
            where = searchFields.map(field => {
                const condition: any = { ...where };
                condition[field] = ILike(`%${global}%`);
                return condition;
            });
        }

        const [docs, totalData] = await this.objectiveRepository.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            skip,
            take,
            relations: ['contrato', 'soportes'],
            order: { fechaCreacion: 'DESC' } as any,
        });

        return {
            message: 'Objectives paginated successfully',
            data: docs,
            meta: {
                totalData: totalData,
            },
        };
    }

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
