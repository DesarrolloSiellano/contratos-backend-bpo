import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('idempotency')
export class Idempotency {
  @PrimaryColumn()
  key: string; // El UUID enviado por el cliente

  @Column({ type: 'jsonb' })
  response: any; // El cuerpo de la respuesta guardada

  @Column()
  method: string; // POST, PATCH, etc.

  @Column()
  path: string; // La ruta del endpoint

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  @Index({ expireAfterSeconds: 86400 }) // Expira en 24 horas (opcional, manejado por lógica)
  expiresAt: Date;
}
