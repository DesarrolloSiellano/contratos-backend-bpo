import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Tarea } from '../../task/entities/task.entity';
import { Period } from '../../period/entities/period.entity';
import { Contratista } from '../../contractor/entities/contractor.entity';
import { Objective } from '../../objective/entities/objective.entity';

@Entity('soportes')
@Index(['company', 'tenantId'])
export class Support {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // --- METADATA DEL ARCHIVO ---
    @Column({ type: 'varchar', length: 255 })
    filename: string;

    @Column({ type: 'varchar', length: 255, name: 'original_filename' })
    originalFilename: string;

    @Column({ type: 'varchar', length: 100 })
    mimetype: string;

    @Column({ type: 'varchar', length: 50 })
    size: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    extension: string;

    @Column({ type: 'text' })
    path: string;

    @Column({ type: 'text', nullable: true })
    url: string;

    // --- INFORMACIÓN ADICIONAL (MIGRACIÓN) ---
    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_peso' })
    porcentajePeso: number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    responsable: string;

    // --- FLUJO DE REVISIÓN ---
    @Column({ type: 'boolean', default: false })
    revisado: boolean;

    @Column({ type: 'boolean', default: false })
    rechazado: boolean;

    @Column({ type: 'date', nullable: true, name: 'fecha_revision' })
    fechaRevision: Date | null;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @Column({ type: 'varchar', length: 150, nullable: true, name: 'tenant_id' })
    tenantId: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
    fechaModificacion: Date;

    // --- RELACIONES ---

    @ManyToOne(() => Contract, (contract) => contract.soportes, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Index('idx_soportes_contrato')
    @Column({ name: 'contrato_id', nullable: true })
    contratoId: string;

    @ManyToOne(() => Tarea, (tarea) => tarea.soportes, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'tarea_id' })
    tarea: Tarea;

    @Index('idx_soportes_tarea')
    @Column({ name: 'tarea_id', nullable: true })
    tareaId: string;

    @ManyToOne(() => Period, (period) => period.soportes, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'periodo_id' })
    periodo: Period;

    @Index('idx_soportes_periodo')
    @Column({ name: 'periodo_id', nullable: true })
    periodoId: string;

    @ManyToOne(() => Contratista, (contratista) => contratista.soportes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contratista_id' })
    contratista: Contratista;

    @Column({ name: 'contratista_id', nullable: true })
    contratistaId: string;

    @ManyToOne(() => Objective, (objective) => objective.soportes, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'objetivo_id' })
    objetivo: Objective;

    @Column({ name: 'objetivo_id', nullable: true })
    objetivoId: string;
}
