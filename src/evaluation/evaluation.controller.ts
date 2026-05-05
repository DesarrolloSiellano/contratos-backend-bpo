import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@ApiTags('evaluaciones')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('evaluation')
export class EvaluationController {
    constructor(private readonly evaluationService: EvaluationService) {}

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
