import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNotEmpty,
    IsDateString,
    IsNumber,
    MaxLength,
} from 'class-validator';

export class CreateContractDto {
    @ApiPropertyOptional({ description: 'ID del supervisor (auth_ms)', example: 'uuid-supervisor' })
    @IsString()
    @IsOptional()
    idSupervisor?: string;

    @ApiPropertyOptional({ description: 'Documento del contratista', example: '123456789' })
    @IsString()
    @IsOptional()
    documentoContratista?: string;

    @ApiPropertyOptional({ description: 'Año del contrato', example: '2024' })
    @IsString()
    @IsOptional()
    @MaxLength(4)
    ano?: string;

    @ApiProperty({ description: 'Número del contrato', example: 'CON-001' })
    @IsString()
    @IsNotEmpty()
    numeroContrato: string;

    @ApiPropertyOptional({ description: 'Nombre del referente', example: 'Pedro Alcántara' })
    @IsString()
    @IsOptional()
    nombreReferente?: string;

    @ApiPropertyOptional({ description: 'Cargo', example: 'Especialista' })
    @IsString()
    @IsOptional()
    cargo?: string;

    @ApiPropertyOptional({ description: 'Fecha de inicio del periodo', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    periodoInicio?: string;

    @ApiPropertyOptional({ description: 'Fecha de fin del periodo', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    periodoFin?: string;

    @ApiPropertyOptional({ description: 'Responsable supervisor', example: 'Juan Manuel' })
    @IsString()
    @IsOptional()
    responsableSupervisor?: string;

    @ApiPropertyOptional({ description: 'Subsecretarías involucradas' })
    @IsString()
    @IsOptional()
    subsecretarias?: string;

    @ApiPropertyOptional({ description: 'Descripción de la obligación' })
    @IsString()
    @IsOptional()
    descripcionObligacion?: string;

    @ApiPropertyOptional({ description: 'Actividad estratégica' })
    @IsString()
    @IsOptional()
    actividadEstrategica?: string;

    @ApiPropertyOptional({ description: 'Descripción de la meta' })
    @IsString()
    @IsOptional()
    descripcionMeta?: string;

    @ApiPropertyOptional({ description: 'Meta cuantitativa' })
    @IsString()
    @IsOptional()
    metaCuantitativa?: string;

    @ApiPropertyOptional({ description: 'Unidad de medida' })
    @IsString()
    @IsOptional()
    unidad?: string;

    @ApiPropertyOptional({ description: 'Meta por trimestre' })
    @IsString()
    @IsOptional()
    metaTrimestre?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de la meta por trimestre' })
    @IsString()
    @IsOptional()
    metaPorcentajeTrimestre?: string;

    @ApiPropertyOptional({ description: '¿Contrato completado?', default: false })
    @IsBoolean()
    @IsOptional()
    completado?: boolean;

    @ApiPropertyOptional({ description: '¿Contrato vigente?', default: true })
    @IsBoolean()
    @IsOptional()
    vigente?: boolean;

    @ApiPropertyOptional({ description: '¿Contrato prorrogado?', default: false })
    @IsBoolean()
    @IsOptional()
    prorrogrado?: boolean;

    @ApiPropertyOptional({ description: '¿Contrato detenido?', default: false })
    @IsBoolean()
    @IsOptional()
    detenido?: boolean;

    @ApiPropertyOptional({ description: 'Estado actual del contrato', example: 'En ejecución' })
    @IsString()
    @IsOptional()
    estado?: string;

    @ApiPropertyOptional({ description: 'Porcentaje total de avance' })
    @IsString()
    @IsOptional()
    porcentajeTotal?: string;

    @ApiPropertyOptional({ description: 'Porcentaje restante de avance' })
    @IsString()
    @IsOptional()
    porcentajeRestante?: string;

    @ApiPropertyOptional({ description: 'Valor total del contrato' })
    @IsString()
    @IsOptional()
    valorTotalContrato?: string;

    @ApiPropertyOptional({ description: 'Número del periodo' })
    @IsString()
    @IsOptional()
    numeroPeriodo?: string;

    @ApiPropertyOptional({ description: 'Valor para los periodos' })
    @IsString()
    @IsOptional()
    valorParaPeriodos?: string;

    @ApiProperty({ description: 'ID del contratista asociado', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    contratistaId: number;

    @ApiPropertyOptional({ description: 'ID de la empresa', example: 'mi-empresa-id' })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    company?: string;
}
