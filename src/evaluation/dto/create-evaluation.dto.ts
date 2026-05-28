import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsDateString,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreateEvaluationDto {
    @ApiPropertyOptional({ description: 'Fecha de la evaluación', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaEvaluacion?: string;

    @ApiPropertyOptional({ description: 'Nombre del responsable de la evaluación', example: 'Juan Supervisor' })
    @IsString()
    @IsOptional()
    responsable?: string;

    @ApiPropertyOptional({ description: 'Porcentaje evaluado', example: '100%' })
    @IsString()
    @IsOptional()
    porcentajeEvaluado?: string;

    @ApiPropertyOptional({ description: 'Observaciones generales' })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiPropertyOptional({ description: 'Rango del periodo evaluado', example: 'Enero 2024' })
    @IsString()
    @IsOptional()
    rangoPeriodo?: string;

    @ApiPropertyOptional({ description: 'Fecha inicio del periodo', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    periodoIni?: string;

    @ApiPropertyOptional({ description: 'Fecha fin del periodo', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    periodoFin?: string;

    @ApiPropertyOptional({ description: 'ID externo del periodo para trazabilidad' })
    @IsString()
    @IsOptional()
    idPeriodo?: string;

    @ApiPropertyOptional({ description: 'Número del periodo evaluado', example: '1' })
    @IsString()
    @IsOptional()
    periodoNumero?: string;

    @ApiPropertyOptional({ description: 'Valor económico del periodo', example: '2.500.000' })
    @IsString()
    @IsOptional()
    valorPeriodo?: string;

    @ApiProperty({ description: 'ID del contrato asociado (UUID)', example: 'uuid-contrato' })
    @IsString()
    @IsNotEmpty()
    contratoId: string;

    @ApiProperty({ description: 'ID del contratista asociado', example: 'uuid-contratista' })
    @IsString()
    @IsNotEmpty()
    contratistaId: string;

    @ApiPropertyOptional({ description: 'ID del periodo asociado (UUID)' })
    @IsString()
    @IsOptional()
    periodoId?: string;

    @ApiPropertyOptional({ description: 'ID de la empresa', example: 'mi-empresa-id' })
    @IsString()
    @IsOptional()
    company?: string;
}
