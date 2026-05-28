import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBase } from '../../database/tenant.base.schema';

@Schema({ timestamps: true, collection: 'email_configs' })
export class EmailConfig extends TenantBase {
  @Prop({ required: true })
  host: string;

  @Prop({ required: true })
  port: number;

  @Prop({ default: false })
  secure: boolean;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  pass: string;

  @Prop({ default: 'SupportCenter' })
  fromName: string;

  @Prop({ required: true })
  fromEmail: string;

  @Prop()
  cc: string; // Correos globales en copia (separados por coma)

  @Prop()
  bcc: string; // Correos globales en copia oculta (separados por coma)

  @Prop({ default: true })
  isActive: boolean;
}

export type EmailConfigDocument = EmailConfig & Document;
export const EmailConfigSchema = SchemaFactory.createForClass(EmailConfig);

// Índice único por empresa y tenant para asegurar una sola configuración activa
EmailConfigSchema.index({ company: 1, tenantId: 1 }, { unique: true });
