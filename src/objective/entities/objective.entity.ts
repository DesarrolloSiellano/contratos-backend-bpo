import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Support } from '../../support/entities/support.entity';

@Entity('objetivos')
export class Objective {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    objetivo: string;

    @Column({ type: 'text', nullable: true })
    producto: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
    fechaModificacion: Date;

    // --- RELACIONES ---

    @ManyToOne(() => Contract, (contract) => contract.objetivos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Column({ name: 'contrato_id' })
    contratoId: string;

    @OneToMany(() => Support, (support) => support.objetivo)
    soportes: Support[];
}
