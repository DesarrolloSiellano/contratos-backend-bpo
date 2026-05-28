import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TenantBase } from '../../database/tenant.base.schema';

@Schema({ timestamps: true, collection: 'email_outbox' })
export class EmailOutbox extends TenantBase {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  cc: string;

  @Prop()
  bcc: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: 'pending' })
  status: string; // pending, sent, failed

  @Prop()
  error: string;

  @Prop()
  sentAt: Date;
}

export type EmailOutboxDocument = EmailOutbox & Document;
export const EmailOutboxSchema = SchemaFactory.createForClass(EmailOutbox);

EmailOutboxSchema.index({ tenantId: 1, company: 1, status: 1 });
