import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSupportDto } from './create-support.dto';
import { IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {
    @ApiPropertyOptional({ description: 'Estado de revisión' })
    @IsBoolean()
    @IsOptional()
    revisado?: boolean;

    @ApiPropertyOptional({ description: 'Estado de rechazo' })
    @IsBoolean()
    @IsOptional()
    rechazado?: boolean;

    @ApiPropertyOptional({ description: 'Fecha de revisión', type: 'string', format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaRevision?: string;
}
