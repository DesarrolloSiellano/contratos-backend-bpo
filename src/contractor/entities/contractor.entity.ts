import { OneToMany, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';
import { ContractorChecklist } from '../../contractor-checklist/entities/contractor-checklist.entity';
import { Contract } from '../../contract/entities/contract.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
import { Period } from '../../period/entities/period.entity';
import { Support } from '../../support/entities/support.entity';

@Entity('contratistas')
export class Contratista {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'fecha_creacion',
    })
    fechaCreacion: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'fecha_modificacion',
    })
    fechaModificacion: Date;

    @Column({ type: 'varchar', length: 150, nullable: true })
    nom: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    ape: string;

    @Column({ type: 'varchar', length: 200, nullable: true, name: 'nombre_referente' })
    nombreReferente: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tel: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    celular: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    genero: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    direccion: string;

    @Column({ type: 'varchar', length: 120, nullable: true })
    ciudad: string;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'tipo_doc' })
    tipoDoc: string;

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false,
        name: 'numero_doc',
    })
    numeroDoc: string;

    @Column({ type: 'varchar', length: 120, nullable: true, name: 'ciudad_expedicion' })
    ciudadExpedicion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    estado: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    rol: string;

    @Column({ type: 'date', nullable: true, name: 'fecha_nacimiento' })
    fechaNacimiento: string;

    @Column({
        type: 'boolean',
        default: false,
        name: 'contrato_vigente',
    })
    contratoVigente: boolean;

    @Column({ type: 'varchar', length: 150, nullable: true })
    company: string;

    @OneToMany(() => ContractorChecklist, (checklist) => checklist.contratista)
    listasChequeo: ContractorChecklist[];

    @OneToMany(() => Contract, (contract) => contract.contratista)
    contratos: Contract[];

    @OneToMany(() => Evaluation, (evaluation) => evaluation.contratista)
    evaluaciones: Evaluation[];

    @OneToMany(() => Period, (period) => period.contratista)
    periodos: Period[];

    @OneToMany(() => Support, (support) => support.contratista)
    soportes: Support[];
}