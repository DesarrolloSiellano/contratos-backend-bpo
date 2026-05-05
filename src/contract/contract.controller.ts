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
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('contratos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('contract')
export class ContractController {
    constructor(private readonly contractService: ContractService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo contrato' })
    @ApiResponse({ status: 201, description: 'El contrato ha sido creado exitosamente.' })
    create(@Body() createDto: CreateContractDto) {
        return this.contractService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los contratos' })
    @ApiResponse({ status: 200, description: 'Lista de todos los contratos.' })
    findAll() {
        return this.contractService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un contrato por ID' })
    @ApiResponse({ status: 200, description: 'El contrato encontrado.' })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado.' })
    findOne(@Param('id') id: string) {
        return this.contractService.findOne(id);
    }

    @Get('number/:numeroContrato')
    @ApiOperation({ summary: 'Obtener un contrato por número de contrato' })
    @ApiResponse({ status: 200, description: 'El contrato encontrado.' })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado.' })
    findByNumber(@Param('numeroContrato') numeroContrato: string) {
        return this.contractService.findByNumber(numeroContrato);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un contrato por ID' })
    @ApiResponse({ status: 200, description: 'El contrato ha sido actualizado exitosamente.' })
    update(
        @Param('id') id: string,
        @Body() updateDto: UpdateContractDto,
    ) {
        return this.contractService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un contrato por ID' })
    @ApiResponse({ status: 200, description: 'El contrato ha sido eliminado exitosamente.' })
    remove(@Param('id') id: string) {
        return this.contractService.remove(id);
    }
}
