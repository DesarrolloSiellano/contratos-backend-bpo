import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { Support } from './entities/support.entity';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Contratista } from '../contractor/entities/contractor.entity';
import { Contract } from '../contract/entities/contract.entity';
import { MailService } from '../core/mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SupportService {
    private readonly uploadPath = './uploads/supports';

    constructor(
        @InjectRepository(Support)
        private readonly supportRepository: Repository<Support>,
        private readonly mailService: MailService,
        private readonly dataSource: DataSource,
    ) {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    async findByPage(
        user: any,
        from: number = 0,
        limit: number = 10,
        global?: string,
    ) {
        const skip = from;
        const take = limit;

        let where: any = {};

        if (global) {
            const searchFields = ['originalFilename', 'descripcion', 'responsable', 'company'];
            where = searchFields.map(field => {
                const condition: any = { ...where };
                condition[field] = ILike(`%${global}%`);
                return condition;
            });
        }

        const [docs, totalData] = await this.supportRepository.findAndCount({
            where: Object.keys(where).length > 0 ? where : undefined,
            skip,
            take,
            relations: ['contrato', 'tarea', 'periodo', 'contratista', 'objetivo'],
            order: { fechaCreacion: 'DESC' } as any,
        });

        return {
            message: 'Supports paginated successfully',
            data: docs,
            meta: {
                totalData: totalData,
            },
        };
    }

    async uploadFile(file: Express.Multer.File, createDto: CreateSupportDto) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // BR-16: Flujo de Corrección y Sustitución de Soporte Rechazado
        if (createDto.replaceSupportId) {
            const oldSupport = await this.supportRepository.findOne({
                where: { id: createDto.replaceSupportId }
            });

            if (!oldSupport) {
                throw new NotFoundException(`El soporte original con ID ${createDto.replaceSupportId} no existe.`);
            }

            // Eliminar archivo físico anterior
            if (fs.existsSync(oldSupport.path)) {
                try {
                    fs.unlinkSync(oldSupport.path);
                    console.log(`[FILE UNLINK] Archivo físico eliminado con éxito: ${oldSupport.path}`);
                } catch (unlinkErr) {
                    console.error(`Error al eliminar archivo físico anterior:`, unlinkErr);
                }
            }

            // Actualizar soporte existente restableciendo los estados a pendiente
            const updatedSupport = await this.supportRepository.preload({
                id: oldSupport.id,
                filename: file.filename,
                originalFilename: file.originalname,
                mimetype: file.mimetype,
                size: file.size.toString(),
                extension: path.extname(file.originalname).toLowerCase(),
                path: file.path,
                url: `/api/support/download/${file.filename}`,
                revisado: false,
                rechazado: false,
                fechaRevision: null,
                descripcion: createDto.descripcion || oldSupport.descripcion,
                porcentajePeso: createDto.porcentajePeso ? Number(createDto.porcentajePeso) : oldSupport.porcentajePeso,
                responsable: createDto.responsable || oldSupport.responsable,
            });

            if (!updatedSupport) {
                throw new BadRequestException('Fallo al precargar el soporte de reemplazo');
            }

            const saved: Support = await this.supportRepository.save(updatedSupport);

            // Alerta por correo al Supervisor (BR-16)
            const contract = await this.dataSource.getRepository(Contract).findOne({
                where: { id: saved.contratoId },
                relations: ['contratista']
            });

            const supervisorEmail = 'supervisor@siisweb.com'; // Fallback de correo del supervisor
            const contractorName = contract?.contratista ? `${contract.contratista.nom} ${contract.contratista.ape}` : 'Contratista';

            await this.mailService.sendMailWithTemplate(
                supervisorEmail,
                'reject_alert',
                {
                    contratistaName: contractorName,
                    numeroContrato: contract?.numeroContrato || 'N/A',
                    filename: file.originalname,
                }
            ).catch(err => console.error('Error al notificar al supervisor por correo:', err));

            return {
                message: 'Support file replaced and corrected successfully',
                data: saved,
            };
        }

        // Flujo normal de subida
        const support = this.supportRepository.create({
            ...createDto,
            filename: file.filename,
            originalFilename: file.originalname,
            mimetype: file.mimetype,
            size: file.size.toString(),
            extension: path.extname(file.originalname).toLowerCase(),
            path: file.path,
            url: `/api/support/download/${file.filename}`,
            porcentajePeso: createDto.porcentajePeso ? Number(createDto.porcentajePeso) : 0,
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
        const support = await this.supportRepository.findOne({ where: { id } });
        if (!support) {
            throw new NotFoundException(`Support with ID ${id} not found`);
        }

        // BR-15: Notificación de rechazo inmediato al contratista por correo
        if (updateDto.rechazado === true && !support.rechazado) {
            const contractor = await this.dataSource.getRepository(Contratista).findOne({
                where: { id: support.contratistaId }
            });
            if (contractor && contractor.email) {
                await this.mailService.sendMailWithTemplate(
                    contractor.email,
                    'reject',
                    {
                        contratistaName: `${contractor.nom} ${contractor.ape}`,
                        filename: support.originalFilename,
                        observaciones: updateDto.descripcion || 'Sin observaciones añadidas.',
                    }
                ).catch(err => console.error('Error al enviar correo de rechazo:', err));
            }
        }

        const preloaded = await this.supportRepository.preload({
            id,
            ...updateDto,
            porcentajePeso: updateDto.porcentajePeso !== undefined ? Number(updateDto.porcentajePeso) : undefined,
        });

        if (!preloaded) {
            throw new NotFoundException(`Support with ID ${id} not found`);
        }

        const updated = await this.supportRepository.save(preloaded);
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
