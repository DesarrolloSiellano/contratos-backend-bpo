import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class CreateSupportDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Archivo físico a subir' })
    file: any;

    @ApiPropertyOptional({ description: 'Descripción o nota sobre el soporte' })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de peso o relevancia' })
    @IsString()
    @IsOptional()
    porcentajePeso?: string;

    @ApiPropertyOptional({ description: 'Responsable' })
    @IsString()
    @IsOptional()
    responsable?: string;

    @ApiProperty({ description: 'ID del contratista (propietario)', example: 'uuid-contratista' })
    @IsString()
    @IsNotEmpty()
    contratistaId: string;

    @ApiPropertyOptional({ description: 'ID del soporte rechazado que se está reemplazando' })
    @IsString()
    @IsOptional()
    replaceSupportId?: string;

    @ApiPropertyOptional({ description: 'ID del contrato asociado' })
    @IsString()
    @IsOptional()
    contratoId?: string;

    @ApiPropertyOptional({ description: 'ID de la tarea asociada' })
    @IsString()
    @IsOptional()
    tareaId?: string;

    @ApiPropertyOptional({ description: 'ID del periodo asociado' })
    @IsString()
    @IsOptional()
    periodoId?: string;

    @ApiPropertyOptional({ description: 'ID del objetivo asociado' })
    @IsString()
    @IsOptional()
    objetivoId?: string;

    @ApiPropertyOptional({ description: 'ID de la empresa', example: 'mi-empresa-id' })
    @IsString()
    @IsOptional()
    company?: string;
}
