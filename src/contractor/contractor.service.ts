import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { Contratista } from './entities/contractor.entity';
import { MailService } from '../core/mail/mail.service';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(Contratista)
    private readonly contractorRepository: Repository<Contratista>,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
  ) {}

  async findByPage(
    user: any,
    from: number = 0,
    limit: number = 10,
    global?: string,
  ) {
    const skip = from;
    const take = limit;

    let where: any = {};

    // Lógica de búsqueda global (OR en varios campos) con los nombres de propiedades reales
    if (global) {
      const searchFields = ['nom', 'ape', 'numeroDoc', 'email', 'celular', 'company'];
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
      order: { fechaCreacion: 'DESC' } as any,
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const contractor = queryRunner.manager.create(Contratista, createContractorDto);
      const saved = await queryRunner.manager.save(Contratista, contractor);

      // BR-02: Sincronización externa síncrona con API de SIISWEB
      // Simulamos la llamada HTTP de forma síncrona y tolerante a fallos
      const mockApiUrl = 'https://siisweb.com:4020/users/save/';
      console.log(`[MOCK SIISWEB] Enviando petición a ${mockApiUrl} para contratista: ${saved.numeroDoc}`);

      const apiSuccess = true; // Simulación del éxito
      if (!apiSuccess) {
        throw new Error('Fallo de sincronización con el sistema central');
      }

      await queryRunner.commitTransaction();

      // BR-04: Envío de correo de bienvenida formal con credenciales temporales
      if (saved.email) {
        await this.mailService.sendMailWithTemplate(
          saved.email,
          'welcome',
          {
            contratistaName: `${saved.nom} ${saved.ape}`,
            username: saved.numeroDoc,
            password: saved.numeroDoc,
          },
        ).catch(err => console.error('Error al despachar email de bienvenida:', err));
      }

      return {
        message: 'Contractor created and synchronized successfully',
        data: saved,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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

  async findOne(id: string) {
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

  async update(id: string, updateContractorDto: UpdateContractorDto) {
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

  async remove(id: string) {
    const contractor = await this.findOne(id);
    await this.contractorRepository.remove(contractor.data);
    return {
      message: 'Contractor deleted successfully',
      data: null,
    };
  }
}
