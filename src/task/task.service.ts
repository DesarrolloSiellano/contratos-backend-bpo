import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tarea } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
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
    const nuevaTarea = this.tareaRepository.create(createTaskDto);
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
    const tarea = await this.tareaRepository.preload({
      id,
      ...updateTaskDto,
    });
    if (!tarea) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    const updated = await this.tareaRepository.save(tarea);
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
