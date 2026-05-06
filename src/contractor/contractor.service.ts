import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { Contratista } from './entities/contractor.entity';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(Contratista)
    private readonly contractorRepository: Repository<Contratista>,
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

    // Si no es SuperAdmin, filtramos por empresa
    if (!isSuperAdmin) {
      where.company = company;
    }

    // Lógica de búsqueda global (OR en varios campos)
    if (global) {
      const searchFields = ['nombres', 'apellidos', 'numeroDocumento', 'email', 'celular', 'company'];
      where = searchFields.map(field => {
        const condition: any = { ...where };
        condition[field] = ILike(`%${global}%`);
        return condition;
      });
    }

    const [docs, totalData] = await this.contractorRepository.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      skip,
      take,
      order: { createdAt: 'DESC' } as any,
    });

    return {
      message: 'Contractors paginated successfully',
      data: docs,
      meta: {
        totalData: totalData,
      },
    };
  }

  async create(createContractorDto: CreateContractorDto) {
    const contractor = this.contractorRepository.create(createContractorDto);
    const saved = await this.contractorRepository.save(contractor);
    return {
      message: 'Contractor created successfully',
      data: saved,
    };
  }

  async findAll() {
    const data = await this.contractorRepository.find({
      relations: ['contratos', 'listasChequeo'],
    });
    return {
      message: 'Contractors found',
      data,
      meta: { totalData: data.length },
    };
  }

  async findOne(id: number) {
    const contractor = await this.contractorRepository.findOne({
      where: { id },
      relations: ['contratos', 'listasChequeo', 'evaluaciones', 'periodos', 'soportes'],
    });
    if (!contractor) {
      throw new NotFoundException(`Contractor with ID ${id} not found`);
    }
    return {
      message: 'Contractor found',
      data: contractor,
    };
  }

  async update(id: number, updateContractorDto: UpdateContractorDto) {
    const contractor = await this.contractorRepository.preload({
      id,
      ...updateContractorDto,
    });
    if (!contractor) {
      throw new NotFoundException(`Contractor with ID ${id} not found`);
    }
    const updated = await this.contractorRepository.save(contractor);
    return {
      message: 'Contractor updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const contractor = await this.findOne(id);
    await this.contractorRepository.remove(contractor.data);
    return {
      message: 'Contractor deleted successfully',
      data: null,
    };
  }
}
