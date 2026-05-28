import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBase } from '../../database/tenant.base.schema';

@Schema({ timestamps: true, collection: 'email_templates' })
export class EmailTemplate extends TenantBase {
  @Prop({ required: true })
  templateKey: string; // 'welcome', 'reject', 'evaluation'

  @Prop({ required: true })
  subject: string; // Asunto del correo, con soporte para {{variables}}

  @Prop({ required: true })
  htmlContent: string; // Cuerpo HTML, con soporte para {{variables}}
}

export type EmailTemplateDocument = EmailTemplate & Document;
export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);

// Unicidad de plantilla por empresa, tenant y clave
EmailTemplateSchema.index({ company: 1, tenantId: 1, templateKey: 1 }, { unique: true });
