import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsEmail,
    IsBoolean,
    IsNotEmpty,
    MaxLength,
    IsDateString,
} from 'class-validator';

export class CreateContractorDto {
    @ApiPropertyOptional({ description: 'Nombres del contratista', example: 'Juan' })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    nom?: string;

    @ApiPropertyOptional({ description: 'Apellidos del contratista', example: 'Pérez' })
    @IsString()
    @IsOptional()
    @MaxLength(150)
    ape?: string;

    @ApiPropertyOptional({ description: 'Nombre del referente', example: 'Pedro Alcántara' })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    nombreReferente?: string;

    @ApiPropertyOptional({ description: 'Correo electrónico', example: 'juan.perez@example.com' })
    @IsEmail({}, { message: 'El formato del correo es inválido' })
    @IsOptional()
    @MaxLength(150)
    email?: string;

    @ApiPropertyOptional({ description: 'Teléfono fijo', example: '601234567' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    tel?: string;

    @ApiPropertyOptional({ description: 'Número de celular', example: '3001234567' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    celular?: string;

    @ApiPropertyOptional({ description: 'Género', example: 'Masculino' })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    genero?: string;

    @ApiPropertyOptional({ description: 'Dirección de residencia', example: 'Calle 123 # 45-67' })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    direccion?: string;

    @ApiPropertyOptional({ description: 'Ciudad', example: 'Bogotá' })
    @IsString()
    @IsOptional()
    @MaxLength(120)
    ciudad?: string;

    @ApiPropertyOptional({ description: 'Tipo de documento', example: 'CC' })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    tipoDoc?: string;

    @ApiProperty({ description: 'Número de documento', example: '1234567890' })
    @IsString()
    @IsNotEmpty({ message: 'El número de documento es obligatorio' })
    @MaxLength(50)
    numeroDoc: string;

    @ApiPropertyOptional({ description: 'Ciudad de expedición del documento', example: 'Medellín' })
    @IsString()
    @IsOptional()
    @MaxLength(120)
    ciudadExpedicion?: string;

    @ApiPropertyOptional({ description: 'Estado del contratista', example: 'Activo' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    estado?: string;

    @ApiPropertyOptional({ description: 'Rol asignado', example: 'Contratista' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    rol?: string;

    @ApiPropertyOptional({ description: 'Fecha de nacimiento', type: 'string', format: 'date', example: '1990-01-01' })
    @IsDateString()
    @IsOptional()
    fechaNacimiento?: string;

    @ApiPropertyOptional({ description: '¿Contrato vigente?', default: false, example: true })
    @IsBoolean()
    @IsOptional()
    contratoVigente?: boolean;
}
