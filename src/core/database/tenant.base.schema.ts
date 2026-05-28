import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TenantBase extends Document {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  tenantId: string;
}
