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

    async create(createDto: CreateContractDto): Promise<Contract> {
        const contract = this.contractRepository.create(createDto);
        return await this.contractRepository.save(contract);
    }

    async findAll(): Promise<Contract[]> {
        return await this.contractRepository.find({
            relations: ['contratista', 'tareas'],
        });
    }

    async findOne(id: string): Promise<Contract> {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: ['contratista', 'tareas'],
        });
        if (!contract) {
            throw new NotFoundException(`Contrato con ID ${id} no encontrado`);
        }
        return contract;
    }

    async findByNumber(numeroContrato: string): Promise<Contract> {
        const contract = await this.contractRepository.findOne({
            where: { numeroContrato },
            relations: ['contratista', 'tareas'],
        });
        if (!contract) {
            throw new NotFoundException(`Contrato número ${numeroContrato} no encontrado`);
        }
        return contract;
    }

    async update(id: string, updateDto: UpdateContractDto): Promise<Contract> {
        const contract = await this.findOne(id);
        const updated = Object.assign(contract, updateDto);
        return await this.contractRepository.save(updated);
    }

    async remove(id: string): Promise<void> {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract);
    }
}
