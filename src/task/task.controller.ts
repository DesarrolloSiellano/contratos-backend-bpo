import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tareas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('page')
  @ApiOperation({ summary: 'Obtener tareas paginadas con búsqueda global' })
  @ApiQuery({ name: 'from', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'global', required: false, type: String })
  findByPage(
    @Query('from') from: number,
    @Query('limit') limit: number,
    @Query('global') global: string,
    @Req() req: any,
  ) {
    return this.taskService.findByPage(req.user, from, limit, global);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'La tarea ha sido creada exitosamente.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las tareas.' })
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'La tarea encontrada.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea por ID' })
  @ApiResponse({ status: 200, description: 'La tarea ha sido actualizada.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea por ID' })
  @ApiResponse({ status: 200, description: 'La tarea ha sido eliminada.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.remove(id);
  }
}
