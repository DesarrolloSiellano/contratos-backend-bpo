import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Contratista } from '../../contractor/entities/contractor.entity';

@Entity('listas_chequeo_contratistas')
export class ContractorChecklist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, nullable: true, name: 'lider_proceso' })
    liderProceso: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_entrega_inicial' })
    fechaEntregaInicial: Date;

    @Column({ type: 'date', nullable: true, name: 'fecha_recepcion_completa' })
    fechaRecepcionCompleta: Date;

    @Column({ type: 'varchar', length: 150, nullable: true })
    ocupacion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    telefono: string;

    // Relación con el contratista
    @ManyToOne(() => Contratista, (contratista) => contratista.listasChequeo, { eager: true })
    @JoinColumn({ name: 'contratista_id' })
    contratista: Contratista;

    @Column({ name: 'contratista_id' })
    contratistaId: number;

    // --- DOCUMENTOS PROYECTADOS POR LA ENTIDAD (HROB) ---
    @Column({ type: 'varchar', length: 5, nullable: true })
    cdp_verif: string;
    @Column({ type: 'text', nullable: true })
    cdp_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    analisisSector_verif: string;
    @Column({ type: 'text', nullable: true })
    analisisSector_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    estudioPrevio_verif: string;
    @Column({ type: 'text', nullable: true })
    estudioPrevio_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    inexistenciaPersonal_verif: string;
    @Column({ type: 'text', nullable: true })
    inexistenciaPersonal_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    idoneidad_verif: string;
    @Column({ type: 'text', nullable: true })
    idoneidad_obs: string;

    // --- DOCUMENTOS PERSONALES DE LOS CONTRATISTAS ---
    @Column({ type: 'varchar', length: 5, nullable: true })
    propuesta_verif: string;
    @Column({ type: 'text', nullable: true })
    propuesta_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    cedula_verif: string;
    @Column({ type: 'text', nullable: true })
    cedula_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    rut_verif: string;
    @Column({ type: 'text', nullable: true })
    rut_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    libretaMilitar_verif: string;
    @Column({ type: 'text', nullable: true })
    libretaMilitar_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    licenciaConduccion_verif: string;
    @Column({ type: 'text', nullable: true })
    licenciaConduccion_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    examenMedico_verif: string;
    @Column({ type: 'text', nullable: true })
    examenMedico_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    eps_verif: string;
    @Column({ type: 'text', nullable: true })
    eps_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    pension_verif: string;
    @Column({ type: 'text', nullable: true })
    pension_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    sigep_verif: string;
    @Column({ type: 'text', nullable: true })
    sigep_obs: string;

    // --- DOCUMENTACION ACADEMICA ---
    @Column({ type: 'varchar', length: 5, nullable: true })
    diplomaBachiller_verif: string;
    @Column({ type: 'text', nullable: true })
    diplomaBachiller_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    actaBachiller_verif: string;
    @Column({ type: 'text', nullable: true })
    actaBachiller_obs: string;

    @Column({ type: 'varchar', length: 5, nullable: true })
    diplomaPregrado_verif: string;
    @Column({ type: 'text', nullable: true })
    diplomaPregrado_obs: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'fecha_modificacion' })
    fechaModificacion: Date;
}
