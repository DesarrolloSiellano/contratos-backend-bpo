import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './mail.service';
import { EmailConfig, EmailConfigSchema } from './schemas/email-config.schema';
import { EmailOutbox, EmailOutboxSchema } from './schemas/email-outbox.schema';
import { EmailTemplate, EmailTemplateSchema } from './schemas/email-template.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailConfig.name, schema: EmailConfigSchema },
      { name: EmailOutbox.name, schema: EmailOutboxSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
