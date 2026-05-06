import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsDateString,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class CreateContractorChecklistDto {
    @ApiPropertyOptional({ description: 'Líder de proceso', example: 'Coordinación Jurídica' })
    @IsString()
    @IsOptional()
    liderProceso?: string;

    @ApiPropertyOptional({ description: 'Fecha de entrega inicial documento', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaEntregaInicial?: string;

    @ApiPropertyOptional({ description: 'Fecha de recepción de documentación completa', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaRecepcionCompleta?: string;

    @ApiPropertyOptional({ description: 'Ocupación', example: 'Abogado' })
    @IsString()
    @IsOptional()
    ocupacion?: string;

    @ApiPropertyOptional({ description: 'Teléfono', example: '3001234567' })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({ description: 'ID del contratista asociado', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    contratistaId: number;

    // --- DOCUMENTOS PROYECTADOS POR LA ENTIDAD ---
    @ApiPropertyOptional({ description: 'CDP - Verificación' }) @IsString() @IsOptional() cdp_verif?: string;
    @ApiPropertyOptional({ description: 'CDP - Observaciones' }) @IsString() @IsOptional() cdp_obs?: string;

    @ApiPropertyOptional({ description: 'Análisis Sector - Verificación' }) @IsString() @IsOptional() analisisSector_verif?: string;
    @ApiPropertyOptional({ description: 'Análisis Sector - Observaciones' }) @IsString() @IsOptional() analisisSector_obs?: string;

    @ApiPropertyOptional({ description: 'Estudio Previo - Verificación' }) @IsString() @IsOptional() estudioPrevio_verif?: string;
    @ApiPropertyOptional({ description: 'Estudio Previo - Observaciones' }) @IsString() @IsOptional() estudioPrevio_obs?: string;

    @ApiPropertyOptional({ description: 'Inexistencia Personal - Verificación' }) @IsString() @IsOptional() inexistenciaPersonal_verif?: string;
    @ApiPropertyOptional({ description: 'Inexistencia Personal - Observaciones' }) @IsString() @IsOptional() inexistenciaPersonal_obs?: string;

    @ApiPropertyOptional({ description: 'Idoneidad - Verificación' }) @IsString() @IsOptional() idoneidad_verif?: string;
    @ApiPropertyOptional({ description: 'Idoneidad - Observaciones' }) @IsString() @IsOptional() idoneidad_obs?: string;

    // --- DOCUMENTOS PERSONALES ---
    @ApiPropertyOptional({ description: 'Propuesta - Verificación' }) @IsString() @IsOptional() propuesta_verif?: string;
    @ApiPropertyOptional({ description: 'Propuesta - Observaciones' }) @IsString() @IsOptional() propuesta_obs?: string;

    @ApiPropertyOptional({ description: 'Cédula - Verificación' }) @IsString() @IsOptional() cedula_verif?: string;
    @ApiPropertyOptional({ description: 'Cédula - Observaciones' }) @IsString() @IsOptional() cedula_obs?: string;

    @ApiPropertyOptional({ description: 'RUT - Verificación' }) @IsString() @IsOptional() rut_verif?: string;
    @ApiPropertyOptional({ description: 'RUT - Observaciones' }) @IsString() @IsOptional() rut_obs?: string;

    @ApiPropertyOptional({ description: 'Libreta Militar - Verificación' }) @IsString() @IsOptional() libretaMilitar_verif?: string;
    @ApiPropertyOptional({ description: 'Libreta Militar - Observaciones' }) @IsString() @IsOptional() libretaMilitar_obs?: string;

    @ApiPropertyOptional({ description: 'Licencia Conducción - Verificación' }) @IsString() @IsOptional() licenciaConduccion_verif?: string;
    @ApiPropertyOptional({ description: 'Licencia Conducción - Observaciones' }) @IsString() @IsOptional() licenciaConduccion_obs?: string;

    @ApiPropertyOptional({ description: 'Examen Médico - Verificación' }) @IsString() @IsOptional() examenMedico_verif?: string;
    @ApiPropertyOptional({ description: 'Examen Médico - Observaciones' }) @IsString() @IsOptional() examenMedico_obs?: string;

    @ApiPropertyOptional({ description: 'EPS - Verificación' }) @IsString() @IsOptional() eps_verif?: string;
    @ApiPropertyOptional({ description: 'EPS - Observaciones' }) @IsString() @IsOptional() eps_obs?: string;

    @ApiPropertyOptional({ description: 'Pensión - Verificación' }) @IsString() @IsOptional() pension_verif?: string;
    @ApiPropertyOptional({ description: 'Pensión - Observaciones' }) @IsString() @IsOptional() pension_obs?: string;

    @ApiPropertyOptional({ description: 'SIGEP II - Verificación' }) @IsString() @IsOptional() sigep_verif?: string;
    @ApiPropertyOptional({ description: 'SIGEP II - Observaciones' }) @IsString() @IsOptional() sigep_obs?: string;

    // --- DOCUMENTACION ACADEMICA ---
    @ApiPropertyOptional({ description: 'Diploma Bachiller - Verificación' }) @IsString() @IsOptional() diplomaBachiller_verif?: string;
    @ApiPropertyOptional({ description: 'Diploma Bachiller - Observaciones' }) @IsString() @IsOptional() diplomaBachiller_obs?: string;

    @ApiPropertyOptional({ description: 'Acta Bachiller - Verificación' }) @IsString() @IsOptional() actaBachiller_verif?: string;
    @ApiPropertyOptional({ description: 'Acta Bachiller - Observaciones' }) @IsString() @IsOptional() actaBachiller_obs?: string;

    @ApiPropertyOptional({ description: 'Diploma Pregrado - Verificación' }) @IsString() @IsOptional() diplomaPregrado_verif?: string;
    @ApiPropertyOptional({ description: 'Diploma Pregrado - Observaciones' }) @IsString() @IsOptional() diplomaPregrado_obs?: string;

    @ApiPropertyOptional({ description: 'ID de la empresa', example: 'mi-empresa-id' })
    @IsString()
    @IsOptional()
    company?: string;
}
