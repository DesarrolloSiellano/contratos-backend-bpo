import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiPropertyOptional({ description: 'Número del contrato', example: 'CON-001' })
    numeroContrato?: string;

    @ApiPropertyOptional({ description: 'Nombre del referente', example: 'Juan Pérez' })
    nombreReferente?: string;

    @ApiPropertyOptional({ description: 'Responsable o supervisor', example: 'Maria Lopez' })
    responsableSupervisor?: string;

    @ApiProperty({ description: 'Descripción de la tarea', example: 'Realizar mantenimiento preventivo' })
    tarea: string;

    @ApiPropertyOptional({ description: 'Estado de la tarea', example: 'Pendiente' })
    estado?: string;

    @ApiPropertyOptional({ description: 'Subsecretarías involucradas' })
    subsecretarias?: string;

    @ApiPropertyOptional({ description: 'Dimensiones' })
    dimensiones?: string;

    @ApiPropertyOptional({ description: 'Responsable asignado' })
    responsable?: string;

    @ApiPropertyOptional({ description: 'Fecha de inicio', type: 'string', format: 'date' })
    fechaInicio?: string;

    @ApiPropertyOptional({ description: 'Fecha de finalización', type: 'string', format: 'date' })
    fechaFinalizacion?: string;

    @ApiPropertyOptional({ description: 'Evidencia (link o descripción)' })
    evidencia?: string;

    @ApiPropertyOptional({ description: 'Comuna' })
    comuna?: string;

    @ApiPropertyOptional({ description: 'Tipo de población impactada' })
    tipoPoblacionImpactada?: string;

    @ApiPropertyOptional({ description: 'Cantidad de población impactada' })
    cantidadPoblacionImpactada?: string;

    @ApiPropertyOptional({ description: 'Días de la semana' })
    diasSemana?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance programado' })
    porcentajeAvanceProgramado?: string;

    @ApiPropertyOptional({ description: 'Porcentaje restante' })
    porcentajeRestante?: string;

    @ApiPropertyOptional({ description: '¿Está completado?', default: false })
    completado?: boolean;

    @ApiPropertyOptional({ description: 'Porcentaje de avance alcanzado' })
    porcentajeAvanceAlzanzado?: string;

    @ApiPropertyOptional({ description: 'Observaciones' })
    observaciones?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance programado acumulado' })
    porcentajeAvanceprogramadoAcumulado?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance no alcanzado acumulado' })
    porcentajeAvanceNoAlcanzadoAcumulado?: string;
}
