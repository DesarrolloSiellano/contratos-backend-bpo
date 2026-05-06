import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tarea } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

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
