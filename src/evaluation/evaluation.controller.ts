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
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@ApiTags('evaluaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluation')
export class EvaluationController {
    constructor(private readonly evaluationService: EvaluationService) {}

    @Get('page')
    @ApiOperation({ summary: 'Obtener evaluaciones paginadas con búsqueda global' })
    @ApiQuery({ name: 'from', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'global', required: false, type: String })
    findByPage(
        @Query('from') from: number,
        @Query('limit') limit: number,
        @Query('global') global: string,
        @Req() req: any,
    ) {
        return this.evaluationService.findByPage(req.user, from, limit, global);
    }

    @Post()
    @ApiOperation({ summary: 'Registrar una nueva evaluación' })
    @ApiResponse({ status: 201, description: 'La evaluación ha sido registrada exitosamente.' })
    create(@Body() createDto: CreateEvaluationDto) {
        return this.evaluationService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las evaluaciones' })
    @ApiResponse({ status: 200, description: 'Lista de todas las evaluaciones.' })
    findAll() {
        return this.evaluationService.findAll();
    }

    @Get('contract/:contractId')
    @ApiOperation({ summary: 'Obtener evaluaciones de un contrato específico' })
    @ApiResponse({ status: 200, description: 'Lista de evaluaciones del contrato.' })
    findByContract(@Param('contractId') contractId: string) {
        return this.evaluationService.findByContract(contractId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una evaluación por ID' })
    @ApiResponse({ status: 200, description: 'La evaluación encontrada.' })
    @ApiResponse({ status: 404, description: 'Evaluación no encontrada.' })
    findOne(@Param('id') id: string) {
        return this.evaluationService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una evaluación por ID' })
    @ApiResponse({ status: 200, description: 'La evaluación ha sido actualizada exitosamente.' })
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdateEvaluationDto,
    ) {
        return this.evaluationService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una evaluación por ID' })
    @ApiResponse({ status: 200, description: 'La evaluación ha sido eliminada exitosamente.' })
    remove(@Param('id') id: string) {
        return this.evaluationService.remove(id);
    }
}
