import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Contratista } from '../../contractor/entities/contractor.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
import { Support } from '../../support/entities/support.entity';

@Entity('periodos')
@Index(['company', 'tenantId'])
export class Period {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_inicial' })
    fechaInicial: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_final' })
    fechaFinal: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'numero_periodo' })
    numeroPeriodo: string;

    @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
    valor: number;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @Column({ type: 'varchar', length: 150, nullable: true, name: 'tenant_id' })
    tenantId: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
    fechaModificacion: Date;

    // --- RELACIONES ---

    @ManyToOne(() => Contract, (contract) => contract.periodos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Index('idx_periodos_contrato')
    @Column({ name: 'contrato_id' })
    contratoId: string;

    @ManyToOne(() => Contratista, (contratista) => contratista.periodos, { eager: true })
    @JoinColumn({ name: 'contratista_id' })
    contratista: Contratista;

    @Column({ name: 'contratista_id', nullable: true })
    contratistaId: string;

    @OneToOne(() => Evaluation, (evaluation) => evaluation.periodo)
    evaluation: Evaluation;

    @OneToMany(() => Support, (support) => support.periodo)
    soportes: Support[];
}
