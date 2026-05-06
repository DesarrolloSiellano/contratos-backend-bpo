import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
    ) {}

    async create(createDto: CreateContractDto) {
        const contract = this.contractRepository.create(createDto);
        const saved = await this.contractRepository.save(contract);
        return {
            message: 'Contract created successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.contractRepository.find({
            relations: ['contratista', 'tareas', 'periodos', 'objetivos', 'soportes'],
        });
        return {
            message: 'Contracts found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: ['contratista', 'tareas', 'periodos', 'objetivos', 'soportes'],
        });
        if (!contract) {
            throw new NotFoundException(`Contract with ID ${id} not found`);
        }
        return {
            message: 'Contract found',
            data: contract,
        };
    }

    async findByNumber(numeroContrato: string) {
        const contract = await this.contractRepository.findOne({
            where: { numeroContrato },
            relations: ['contratista', 'tareas', 'periodos', 'objetivos', 'soportes'],
        });
        if (!contract) {
            throw new NotFoundException(`Contract number ${numeroContrato} not found`);
        }
        return {
            message: 'Contract found',
            data: contract,
        };
    }

    async update(id: string, updateDto: UpdateContractDto) {
        const contract = await this.contractRepository.preload({
            id,
            ...updateDto,
        });
        if (!contract) {
            throw new NotFoundException(`Contract with ID ${id} not found`);
        }
        const updated = await this.contractRepository.save(contract);
        return {
            message: 'Contract updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract.data);
        return {
            message: 'Contract deleted successfully',
            data: null,
        };
    }
}
