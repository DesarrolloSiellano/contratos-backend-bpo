import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Support } from './entities/support.entity';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SupportService {
    private readonly uploadPath = './uploads/supports';

    constructor(
        @InjectRepository(Support)
        private readonly supportRepository: Repository<Support>,
    ) {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async uploadFile(file: Express.Multer.File, createDto: CreateSupportDto): Promise<Support> {
        if (!file) {
            throw new BadRequestException('No se ha proporcionado ningún archivo');
        }

        const support = this.supportRepository.create({
            ...createDto,
            filename: file.filename,
            originalFilename: file.originalname,
            mimetype: file.mimetype,
            size: file.size.toString(),
            extension: path.extname(file.originalname).toLowerCase(),
            path: file.path,
            url: `/api/support/download/${file.filename}`,
        });

        return await this.supportRepository.save(support);
    }

    async findAll(): Promise<Support[]> {
        return await this.supportRepository.find();
    }

    async findOne(id: string): Promise<Support> {
        const support = await this.supportRepository.findOneBy({ id });
        if (!support) {
            throw new NotFoundException(`Soporte con ID ${id} no encontrado`);
        }
        return support;
    }

    async update(id: string, updateDto: UpdateSupportDto): Promise<Support> {
        const support = await this.findOne(id);
        Object.assign(support, updateDto);
        return await this.supportRepository.save(support);
    }

    async remove(id: string): Promise<void> {
        const support = await this.findOne(id);
        
        // Eliminar archivo físico
        if (fs.existsSync(support.path)) {
            fs.unlinkSync(support.path);
        }

        await this.supportRepository.remove(support);
    }

    getFilePath(filename: string): string {
        const filePath = path.join(process.cwd(), 'uploads/supports', filename);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Archivo no encontrado en el servidor');
        }
        return filePath;
    }
}
