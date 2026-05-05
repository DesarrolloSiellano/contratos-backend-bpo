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
import { ContractorChecklistService } from './contractor-checklist.service';
import { CreateContractorChecklistDto } from './dto/create-contractor-checklist.dto';
import { UpdateContractorChecklistDto } from './dto/update-contractor-checklist.dto';

@ApiTags('listas-chequeo-contratistas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('contractor-checklist')
export class ContractorChecklistController {
    constructor(private readonly checklistService: ContractorChecklistService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva lista de chequeo para un contratista' })
    @ApiResponse({ status: 201, description: 'La lista de chequeo ha sido creada exitosamente.' })
    create(@Body() createDto: CreateContractorChecklistDto) {
        return this.checklistService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las listas de chequeo' })
    @ApiResponse({ status: 200, description: 'Lista de todas las listas de chequeo.' })
    findAll() {
        return this.checklistService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una lista de chequeo por ID' })
    @ApiResponse({ status: 200, description: 'La lista de chequeo encontrada.' })
    @ApiResponse({ status: 404, description: 'Lista de chequeo no encontrada.' })
    findOne(@Param('id') id: string) {
        return this.checklistService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una lista de chequeo por ID' })
    @ApiResponse({ status: 200, description: 'La lista de chequeo ha sido actualizada exitosamente.' })
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdateContractorChecklistDto,
    ) {
        return this.checklistService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una lista de chequeo por ID' })
    @ApiResponse({ status: 200, description: 'La lista de chequeo ha sido eliminada exitosamente.' })
    remove(@Param('id') id: string) {
        return this.checklistService.remove(id);
    }
}
