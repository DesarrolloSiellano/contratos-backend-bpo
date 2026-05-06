import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { ObjectiveService } from './objective.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@ApiTags('objetivos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('objective')
export class ObjectiveController {
    constructor(private readonly objectiveService: ObjectiveService) {}

    @Get('page')
    @ApiOperation({ summary: 'Obtener objetivos paginados con búsqueda global' })
    @ApiQuery({ name: 'from', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'global', required: false, type: String })
    findByPage(
        @Query('from') from: number,
        @Query('limit') limit: number,
        @Query('global') global: string,
        @Req() req: any,
    ) {
        return this.objectiveService.findByPage(req.user, from, limit, global);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo objetivo para un contrato' })
    @ApiResponse({ status: 201, description: 'El objetivo ha sido creado exitosamente.' })
    create(@Body() createDto: CreateObjectiveDto) {
        return this.objectiveService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los objetivos' })
    @ApiResponse({ status: 200, description: 'Lista de todos los objetivos.' })
    findAll() {
        return this.objectiveService.findAll();
    }

    @Get('contract/:contractId')
    @ApiOperation({ summary: 'Obtener objetivos de un contrato específico' })
    @ApiResponse({ status: 200, description: 'Lista de objetivos del contrato.' })
    findByContract(@Param('contractId') contractId: string) {
        return this.objectiveService.findByContract(contractId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un objetivo por ID' })
    @ApiResponse({ status: 200, description: 'El objetivo encontrado.' })
    @ApiResponse({ status: 404, description: 'Objetivo no encontrado.' })
    findOne(@Param('id') id: string) {
        return this.objectiveService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un objetivo por ID' })
    @ApiResponse({ status: 200, description: 'El objetivo ha sido actualizado exitosamente.' })
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdateObjectiveDto,
    ) {
        return this.objectiveService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un objetivo por ID' })
    @ApiResponse({ status: 200, description: 'El objetivo ha sido eliminado exitosamente.' })
    remove(@Param('id') id: string) {
        return this.objectiveService.remove(id);
    }
}
