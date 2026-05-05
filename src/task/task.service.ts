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

  async create(createTaskDto: CreateTaskDto): Promise<Tarea> {
    const nuevaTarea = this.tareaRepository.create(createTaskDto);
    return await this.tareaRepository.save(nuevaTarea);
  }

  async findAll(): Promise<Tarea[]> {
    return await this.tareaRepository.find();
  }

  async findOne(id: string): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOneBy({ id });
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return tarea;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    const tareaActualizada = this.tareaRepository.merge(tarea, updateTaskDto);
    return await this.tareaRepository.save(tareaActualizada);
  }

  async remove(id: string): Promise<void> {
    const tarea = await this.findOne(id);
    await this.tareaRepository.remove(tarea);
  }
}
