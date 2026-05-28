import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsDateString,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreatePeriodDto {
    @ApiPropertyOptional({ description: 'Fecha inicial del periodo', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaInicial?: string;

    @ApiPropertyOptional({ description: 'Fecha final del periodo', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaFinal?: string;

    @ApiPropertyOptional({ description: 'Número del periodo', example: '1' })
    @IsString()
    @IsOptional()
    numeroPeriodo?: string;

    @ApiPropertyOptional({ description: 'Valor económico del periodo', example: '2.500.000' })
    @IsString()
    @IsOptional()
    valor?: string;

    @ApiProperty({ description: 'ID del contrato asociado (UUID)', example: 'uuid-contrato' })
    @IsString()
    @IsNotEmpty()
    contratoId: string;

    @ApiProperty({ description: 'ID del contratista asociado', example: 'uuid-contratista' })
    @IsString()
    @IsNotEmpty()
    contratistaId: string;

    @ApiPropertyOptional({ description: 'ID de la empresa', example: 'mi-empresa-id' })
    @IsString()
    @IsOptional()
    company?: string;
}
