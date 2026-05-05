import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Res,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import type { Response } from 'express';

@ApiTags('soportes')
@ApiBearerAuth()
@Controller('support')
export class SupportController {
    constructor(private readonly supportService: SupportService) {}

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/supports',
                filename: (req, file, cb) => {
                    const randomName = uuidv4();
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Subir un nuevo soporte/archivo' })
    @ApiResponse({ status: 201, description: 'Archivo subido y registrado exitosamente.' })
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createDto: CreateSupportDto,
    ) {
        return this.supportService.uploadFile(file, createDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.supportService.findAll();
    }

    @Get('download/:filename')
    @ApiOperation({ summary: 'Descargar un archivo de soporte' })
    downloadFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = this.supportService.getFilePath(filename);
        return res.sendFile(filePath);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.supportService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Actualizar estado de revisión de un soporte' })
    update(@Param('id') id: string, @Body() updateDto: UpdateSupportDto) {
        return this.supportService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.supportService.remove(id);
    }
}
