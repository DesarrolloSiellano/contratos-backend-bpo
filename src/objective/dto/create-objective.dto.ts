import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
} from 'class-validator';

export class CreateObjectiveDto {
    @ApiProperty({ description: 'Descripción detallada del objetivo', example: 'Desarrollar el módulo de reportes' })
    @IsString()
    @IsNotEmpty()
    objetivo: string;

    @ApiPropertyOptional({ description: 'Producto o entregable esperado', example: 'Documento PDF con los reportes mensuales' })
    @IsString()
    @IsOptional()
    producto?: string;

    @ApiProperty({ description: 'ID del contrato asociado (UUID)', example: 'uuid-contrato' })
    @IsString()
    @IsNotEmpty()
    contratoId: string;
}
