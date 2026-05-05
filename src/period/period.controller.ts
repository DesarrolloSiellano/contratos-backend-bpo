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
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@ApiTags('periodos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('period')
export class PeriodController {
    constructor(private readonly periodService: PeriodService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo periodo para un contrato' })
    @ApiResponse({ status: 201, description: 'El periodo ha sido creado exitosamente.' })
    create(@Body() createDto: CreatePeriodDto) {
        return this.periodService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los periodos' })
    @ApiResponse({ status: 200, description: 'Lista de todos los periodos.' })
    findAll() {
        return this.periodService.findAll();
    }

    @Get('contract/:contractId')
    @ApiOperation({ summary: 'Obtener periodos de un contrato específico' })
    @ApiResponse({ status: 200, description: 'Lista de periodos del contrato.' })
    findByContract(@Param('contractId') contractId: string) {
        return this.periodService.findByContract(contractId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un periodo por ID' })
    @ApiResponse({ status: 200, description: 'El periodo encontrado.' })
    @ApiResponse({ status: 404, description: 'Periodo no encontrado.' })
    findOne(@Param('id') id: string) {
        return this.periodService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un periodo por ID' })
    @ApiResponse({ status: 200, description: 'El periodo ha sido actualizado exitosamente.' })
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdatePeriodDto,
    ) {
        return this.periodService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un periodo por ID' })
    @ApiResponse({ status: 200, description: 'El periodo ha sido eliminado exitosamente.' })
    remove(@Param('id') id: string) {
        return this.periodService.remove(id);
    }
}
