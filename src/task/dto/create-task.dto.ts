import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNotEmpty,
    IsDateString,
} from 'class-validator';

export class CreateTaskDto {
    @ApiPropertyOptional({ description: 'ID del contrato asociado (UUID)', example: 'uuid-del-contrato' })
    @IsString()
    @IsOptional()
    contratoId?: string;

    @ApiPropertyOptional({ description: 'Nombre del referente', example: 'Juan Pérez' })
    @IsString()
    @IsOptional()
    nombreReferente?: string;

    @ApiPropertyOptional({ description: 'Responsable o supervisor', example: 'Maria Lopez' })
    @IsString()
    @IsOptional()
    responsableSupervisor?: string;

    @ApiProperty({ description: 'Descripción de la tarea', example: 'Realizar mantenimiento preventivo' })
    @IsString()
    @IsNotEmpty()
    tarea: string;

    @ApiPropertyOptional({ description: 'Estado de la tarea', example: 'Pendiente' })
    @IsString()
    @IsOptional()
    estado?: string;

    @ApiPropertyOptional({ description: 'Subsecretarías involucradas' })
    @IsString()
    @IsOptional()
    subsecretarias?: string;

    @ApiPropertyOptional({ description: 'Dimensiones' })
    @IsString()
    @IsOptional()
    dimensiones?: string;

    @ApiPropertyOptional({ description: 'Responsable asignado' })
    @IsString()
    @IsOptional()
    responsable?: string;

    @ApiPropertyOptional({ description: 'Fecha de inicio', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaInicio?: string;

    @ApiPropertyOptional({ description: 'Fecha de finalización', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaFinalizacion?: string;

    @ApiPropertyOptional({ description: 'Evidencia (link o descripción)' })
    @IsString()
    @IsOptional()
    evidencia?: string;

    @ApiPropertyOptional({ description: 'Comuna' })
    @IsString()
    @IsOptional()
    comuna?: string;

    @ApiPropertyOptional({ description: 'Tipo de población impactada' })
    @IsString()
    @IsOptional()
    tipoPoblacionImpactada?: string;

    @ApiPropertyOptional({ description: 'Cantidad de población impactada' })
    @IsString()
    @IsOptional()
    cantidadPoblacionImpactada?: string;

    @ApiPropertyOptional({ description: 'Días de la semana' })
    @IsString()
    @IsOptional()
    diasSemana?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance programado' })
    @IsString()
    @IsOptional()
    porcentajeAvanceProgramado?: string;

    @ApiPropertyOptional({ description: 'Porcentaje restante' })
    @IsString()
    @IsOptional()
    porcentajeRestante?: string;

    @ApiPropertyOptional({ description: '¿Está completado?', default: false })
    @IsBoolean()
    @IsOptional()
    completado?: boolean;

    @ApiPropertyOptional({ description: 'Porcentaje de avance alcanzado' })
    @IsString()
    @IsOptional()
    porcentajeAvanceAlcanzado?: string;

    @ApiPropertyOptional({ description: 'Observaciones' })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance programado acumulado' })
    @IsString()
    @IsOptional()
    porcentajeAvanceProgramadoAcumulado?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance no alcanzado acumulado' })
    @IsString()
    @IsOptional()
    porcentajeAvanceNoAlcanzadoAcumulado?: string;

    @ApiPropertyOptional({ description: 'ID de la empresa', example: 'mi-empresa-id' })
    @IsString()
    @IsOptional()
    company?: string;
}
