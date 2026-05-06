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

    async uploadFile(file: Express.Multer.File, createDto: CreateSupportDto) {
        if (!file) {
            throw new BadRequestException('No file provided');
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

        const saved = await this.supportRepository.save(support);
        return {
            message: 'File uploaded successfully',
            data: saved,
        };
    }

    async findAll() {
        const data = await this.supportRepository.find();
        return {
            message: 'Supports found',
            data,
            meta: { totalData: data.length },
        };
    }

    async findOne(id: string) {
        const support = await this.supportRepository.findOne({
            where: { id },
            relations: ['contrato', 'tarea', 'periodo', 'contratista', 'objetivo'],
        });
        if (!support) {
            throw new NotFoundException(`Support with ID ${id} not found`);
        }
        return {
            message: 'Support found',
            data: support,
        };
    }

    async update(id: string, updateDto: UpdateSupportDto) {
        const support = await this.supportRepository.preload({
            id,
            ...updateDto,
        });
        if (!support) {
            throw new NotFoundException(`Support with ID ${id} not found`);
        }
        const updated = await this.supportRepository.save(support);
        return {
            message: 'Support updated successfully',
            data: updated,
        };
    }

    async remove(id: string) {
        const support = await this.findOne(id);
        
        // Eliminar archivo físico
        if (fs.existsSync(support.data.path)) {
            fs.unlinkSync(support.data.path);
        }

        await this.supportRepository.remove(support.data);
        return {
            message: 'Support deleted successfully',
            data: null,
        };
    }

    getFilePath(filename: string): string {
        const filePath = path.join(process.cwd(), 'uploads/supports', filename);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('File not found on server');
        }
        return filePath;
    }
}
