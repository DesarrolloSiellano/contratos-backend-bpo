import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Support } from '../../support/entities/support.entity';

@Entity('tareas')
export class Tarea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Contract, (contract) => contract.tareas)
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Column({ name: 'contrato_id', nullable: true })
    contratoId: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    nombreReferente: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    responsableSupervisor: string;

    @Column({ type: 'text' })
    tarea: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    estado: string;

    @Column({ type: 'text', nullable: true })
    subsecretarias: string;

    @Column({ type: 'text', nullable: true })
    dimensiones: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    responsable: string;

    @Column({ type: 'date', nullable: true })
    fechaInicio: string;

    @Column({ type: 'date', nullable: true })
    fechaFinalizacion: string;

    @Column({ type: 'text', nullable: true })
    evidencia: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    comuna: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    tipoPoblacionImpactada: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    cantidadPoblacionImpactada: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    diasSemana: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    porcentajeAvanceProgramado: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    porcentajeRestante: string;

    @Column({ type: 'boolean', default: false })
    completado: boolean;

    @Column({ type: 'varchar', length: 20, nullable: true })
    porcentajeAvanceAlzanzado: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    porcentajeAvanceprogramadoAcumulado: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    porcentajeAvanceNoAlcanzadoAcumulado: string;

    @OneToMany(() => Support, (support) => support.tarea)
    soportes: Support[];
}
