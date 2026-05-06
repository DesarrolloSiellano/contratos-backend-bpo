import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@ApiTags('contratistas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Get('page')
  @ApiOperation({ summary: 'Obtener contratistas paginados con búsqueda global' })
  @ApiQuery({ name: 'from', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'global', required: false, type: String })
  findByPage(
    @Query('from') from: number,
    @Query('limit') limit: number,
    @Query('global') global: string,
    @Req() req: any,
  ) {
    return this.contractorService.findByPage(req.user, from, limit, global);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo contratista' })
  @ApiResponse({ status: 201, description: 'Contratista creado exitosamente.' })
  create(@Body() createContractorDto: CreateContractorDto) {
    return this.contractorService.create(createContractorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los contratistas' })
  @ApiResponse({ status: 200, description: 'Lista de contratistas.' })
  findAll() {
    return this.contractorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contratista por ID' })
  @ApiResponse({ status: 200, description: 'Contratista encontrado.' })
  @ApiResponse({ status: 404, description: 'Contratista no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.contractorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un contratista por ID' })
  @ApiResponse({ status: 200, description: 'Contratista actualizado exitosamente.' })
  update(@Param('id') id: string, @Body() updateContractorDto: UpdateContractorDto) {
    return this.contractorService.update(+id, updateContractorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un contratista por ID' })
  @ApiResponse({ status: 200, description: 'Contratista eliminado exitosamente.' })
  remove(@Param('id') id: string) {
    return this.contractorService.remove(+id);
  }
}
