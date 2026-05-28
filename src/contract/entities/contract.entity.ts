import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Contratista } from '../../contractor/entities/contractor.entity';
import { Tarea } from '../../task/entities/task.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
import { Period } from '../../period/entities/period.entity';
import { Objective } from '../../objective/entities/objective.entity';
import { Support } from '../../support/entities/support.entity';

@Entity('contratos')
@Index(['company', 'tenantId'])
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'supervisor_id',
  })
  idSupervisor: string; // ID externo del microservicio auth_ms

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'documento_contratista',
  })
  documentoContratista: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  anio: string;

  @Index('idx_contratos_numero', { unique: true })
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'numero_contrato',
  })
  numeroContrato: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'nombre_referente',
  })
  nombreReferente: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  cargo: string;

  @Column({ type: 'date', nullable: true, name: 'periodo_inicio' })
  periodoInicio: string;

  @Column({ type: 'date', nullable: true, name: 'periodo_fin' })
  periodoFin: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'responsable_supervisor',
  })
  responsableSupervisor: string;

  @Column({ type: 'text', nullable: true })
  subsecretarias: string;

  @Column({ type: 'text', nullable: true, name: 'descripcion_obligacion' })
  descripcionObligacion: string;

  @Column({ type: 'text', nullable: true, name: 'actividad_estrategica' })
  actividadEstrategica: string;

  @Column({ type: 'text', nullable: true, name: 'descripcion_meta' })
  descripcionMeta: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'meta_cuantitativa',
  })
  metaCuantitativa: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidad: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'meta_trimestre',
  })
  metaTrimestre: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'meta_porcentaje_trimestre',
  })
  metaPorcentajeTrimestre: string;

  @Column({ type: 'boolean', default: false })
  completado: boolean;

  @Column({ type: 'boolean', default: true })
  vigente: boolean;

  @Column({ type: 'boolean', default: false })
  prorrogado: boolean;

  @Column({ type: 'boolean', default: false })
  detenido: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'porcentaje_total',
  })
  porcentajeTotal: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'porcentaje_restante',
  })
  porcentajeRestante: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'valor_total_contrato',
  })
  valorTotalContrato: number;

  @Column({
    type: 'integer',
    nullable: true,
    name: 'numero_periodo',
  })
  numeroPeriodo: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: true,
    name: 'valor_para_periodos',
  })
  valorParaPeriodos: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 150, nullable: true, name: 'tenant_id' })
  tenantId: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
  fechaModificacion: Date;

  // --- RELACIONES ---

  @ManyToOne(() => Contratista, (contratista) => contratista.contratos, {
    eager: true,
  })
  @JoinColumn({ name: 'contratista_id' })
  contratista: Contratista;

  @Index('idx_contratos_contratista')
  @Column({ name: 'contratista_id', nullable: true })
  contratistaId: string;

  @OneToMany(() => Tarea, (tarea) => tarea.contrato)
  tareas: Tarea[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.contrato)
  evaluaciones: Evaluation[];

  @OneToMany(() => Period, (period) => period.contrato)
  periodos: Period[];

  @OneToMany(() => Objective, (objective) => objective.contrato)
  objetivos: Objective[];

  @OneToMany(() => Support, (support) => support.contrato)
  soportes: Support[];
}
