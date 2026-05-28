import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Contratista } from '../../contractor/entities/contractor.entity';
import { Period } from '../../period/entities/period.entity';

@Entity('evaluaciones')
@Index(['company', 'tenantId'])
export class Evaluation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_evaluacion' })
    fechaEvaluacion: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    responsable: string;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_evaluado' })
    porcentajeEvaluado: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'rango_periodo' })
    rangoPeriodo: string;

    @Column({ type: 'date', nullable: true, name: 'periodo_ini' })
    periodoIni: string;

    @Column({ type: 'date', nullable: true, name: 'periodo_fin' })
    periodoFin: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'periodo_numero' })
    periodoNumero: string;

    @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true, name: 'valor_periodo' })
    valorPeriodo: number;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @Column({ type: 'varchar', length: 150, nullable: true, name: 'tenant_id' })
    tenantId: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
    fechaModificacion: Date;

    // --- RELACIONES ---

    @ManyToOne(() => Contract, (contract) => contract.evaluaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Index('idx_evaluaciones_contrato')
    @Column({ name: 'contrato_id' })
    contratoId: string;

    @ManyToOne(() => Contratista, (contratista) => contratista.evaluaciones, { eager: true })
    @JoinColumn({ name: 'contratista_id' })
    contratista: Contratista;

    @Column({ name: 'contratista_id', nullable: true })
    contratistaId: string;

    @OneToOne(() => Period, (period) => period.evaluation)
    @JoinColumn({ name: 'periodo_id' })
    periodo: Period;

    @Index('idx_evaluaciones_periodo')
    @Column({ name: 'periodo_id', nullable: true })
    periodoId: string;
}
