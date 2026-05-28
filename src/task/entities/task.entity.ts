import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { Support } from '../../support/entities/support.entity';

@Entity('tareas')
@Index(['company', 'tenantId'])
export class Tarea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Contract, (contract) => contract.tareas)
    @JoinColumn({ name: 'contrato_id' })
    contrato: Contract;

    @Index('idx_tareas_contrato')
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

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_avance_programado' })
    porcentajeAvanceProgramado: number;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_restante' })
    porcentajeRestante: number;

    @Column({ type: 'boolean', default: false })
    completado: boolean;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_avance_alcanzado' })
    porcentajeAvanceAlcanzado: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_avance_programado_acumulado' })
    porcentajeAvanceProgramadoAcumulado: number;

    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, name: 'porcentaje_avance_no_alcanzado_acumulado' })
    porcentajeAvanceNoAlcanzadoAcumulado: number;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @Column({ type: 'varchar', length: 150, nullable: true, name: 'tenant_id' })
    tenantId: string;

    @OneToMany(() => Support, (support) => support.tarea)
    soportes: Support[];
}
