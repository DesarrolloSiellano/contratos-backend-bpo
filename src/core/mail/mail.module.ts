import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailConfig, EmailConfigSchema } from './schemas/email-config.schema';
import { EmailOutbox, EmailOutboxSchema } from './schemas/email-outbox.schema';
import { EmailTemplate, EmailTemplateSchema } from './schemas/email-template.schema';

@Global()
@Module({
  imports: [
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
