import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Contratista } from '../../contractor/entities/contractor.entity';
import { Period } from '../../period/entities/period.entity';

@Entity('evaluaciones')
export class Evaluation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_evaluacion' })
    fechaEvaluacion: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    responsable: string;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'porcentaje_evaluado' })
    porcentajeEvaluado: string;

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

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'valor_periodo' })
    valorPeriodo: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
    fechaModificacion: Date;

    // --- RELACIONES ---

    @ManyToOne(() => Contract, (contract) => contract.evaluaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Column({ name: 'contrato_id' })
    contratoId: string;

    @ManyToOne(() => Contratista, (contratista) => contratista.evaluaciones, { eager: true })
    @JoinColumn({ name: 'contratista_id' })
    contratista: Contratista;

    @Column({ name: 'contratista_id' })
    contratistaId: number;

    @OneToOne(() => Period, (period) => period.evaluation)
    @JoinColumn({ name: 'periodo_id' })
    periodo: Period;

    @Column({ name: 'periodo_id', nullable: true })
    periodoId: string;
}
