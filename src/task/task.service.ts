import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tarea } from './entities/task.entity';
import { Contract } from '../contract/entities/contract.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
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

    if (global) {
      const searchFields = ['tarea', 'responsable', 'responsableSupervisor', 'nombreReferente', 'company'];
      where = searchFields.map(field => {
        const condition: any = { ...where };
        condition[field] = ILike(`%${global}%`);
        return condition;
      });
    }

    const [docs, totalData] = await this.tareaRepository.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      skip,
      take,
      relations: ['contrato'],
      order: { id: 'DESC' } as any,
    });

    return {
      message: 'Tasks paginated successfully',
      data: docs,
      meta: {
        totalData: totalData,
      },
    };
  }

  async create(createTaskDto: CreateTaskDto) {
    if (!createTaskDto.contratoId) {
      throw new BadRequestException('El contratoId es obligatorio para crear una tarea');
    }

    // 1. Validar que el contrato exista
    const contract = await this.dataSource.getRepository(Contract).findOne({
      where: { id: createTaskDto.contratoId }
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${createTaskDto.contratoId} not found`);
    }

    const newProg = Number(createTaskDto.porcentajeAvanceProgramado || 0);
    const newReal = Number(createTaskDto.porcentajeAvanceAlcanzado || 0);

    // BR-26: Validación de Avance Alcanzado vs Programado
    if (newReal > newProg) {
      throw new BadRequestException('El avance real alcanzado no puede exceder el límite programado y establecido para la tarea.');
    }

    // BR-10: Sumatoria de programados <= 100%
    const existingTasks = await this.tareaRepository.find({
      where: { contratoId: contract.id }
    });
    const currentSum = existingTasks.reduce((acc, t) => acc + Number(t.porcentajeAvanceProgramado || 0), 0);

    if (currentSum + newProg > 100) {
      const available = 100 - currentSum;
      throw new BadRequestException(`La sumatoria de los porcentajes programados no puede exceder el 100%. Porcentaje programado disponible: ${available}%`);
    }

    const nuevaTarea = this.tareaRepository.create({
      ...createTaskDto,
      porcentajeAvanceProgramado: newProg,
      porcentajeRestante: 100 - newProg,
      porcentajeAvanceAlcanzado: newReal,
      porcentajeAvanceProgramadoAcumulado: Number(createTaskDto.porcentajeAvanceProgramadoAcumulado) || 0,
      porcentajeAvanceNoAlcanzadoAcumulado: Number(createTaskDto.porcentajeAvanceNoAlcanzadoAcumulado) || 0,
    });

    const saved = await this.tareaRepository.save(nuevaTarea);
    return {
      message: 'Task created successfully',
      data: saved,
    };
  }

  async findAll() {
    const data = await this.tareaRepository.find({
      relations: ['contrato', 'soportes'],
    });
    return {
      message: 'Tasks found',
      data,
      meta: { totalData: data.length },
    };
  }

  async findOne(id: string) {
    const tarea = await this.tareaRepository.findOne({
      where: { id },
      relations: ['contrato', 'soportes'],
    });
    if (!tarea) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return {
      message: 'Task found',
      data: tarea,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const tarea = await this.tareaRepository.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const newProg = updateTaskDto.porcentajeAvanceProgramado !== undefined
      ? Number(updateTaskDto.porcentajeAvanceProgramado)
      : Number(tarea.porcentajeAvanceProgramado || 0);

    const newReal = updateTaskDto.porcentajeAvanceAlcanzado !== undefined
      ? Number(updateTaskDto.porcentajeAvanceAlcanzado)
      : Number(tarea.porcentajeAvanceAlcanzado || 0);

    // BR-26: Validación de Avance Alcanzado vs Programado
    if (newReal > newProg) {
      throw new BadRequestException('El avance real alcanzado no puede exceder el límite programado y establecido para la tarea.');
    }

    // BR-10: Sumatoria de programados <= 100%
    if (updateTaskDto.porcentajeAvanceProgramado !== undefined && tarea.contratoId) {
      const existingTasks = await this.tareaRepository.find({
        where: { contratoId: tarea.contratoId }
      });
      const currentSum = existingTasks
        .filter(t => t.id !== id)
        .reduce((acc, t) => acc + Number(t.porcentajeAvanceProgramado || 0), 0);

      if (currentSum + newProg > 100) {
        const available = 100 - currentSum;
        throw new BadRequestException(`La sumatoria de los porcentajes programados no puede exceder el 100%. Porcentaje programado disponible para esta tarea: ${available}%`);
      }
    }

    const preloaded = await this.tareaRepository.preload({
      id,
      ...updateTaskDto,
      porcentajeAvanceProgramado: newProg,
      porcentajeRestante: 100 - newProg,
      porcentajeAvanceAlcanzado: newReal,
      porcentajeAvanceProgramadoAcumulado: updateTaskDto.porcentajeAvanceProgramadoAcumulado !== undefined ? Number(updateTaskDto.porcentajeAvanceProgramadoAcumulado) : undefined,
      porcentajeAvanceNoAlcanzadoAcumulado: updateTaskDto.porcentajeAvanceNoAlcanzadoAcumulado !== undefined ? Number(updateTaskDto.porcentajeAvanceNoAlcanzadoAcumulado) : undefined,
    });

    if (!preloaded) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updated = await this.tareaRepository.save(preloaded);
    return {
      message: 'Task updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const tarea = await this.findOne(id);
    await this.tareaRepository.remove(tarea.data);
    return {
      message: 'Task deleted successfully',
      data: null,
    };
  }
}
