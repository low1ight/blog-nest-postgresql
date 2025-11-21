import { Module } from '@nestjs/common';
import { EmailConfig } from './email.config';
import { EmailAdapter } from './email.adapter';
import { EmailService } from './email.service';

@Module({
  providers: [EmailConfig, EmailAdapter, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
