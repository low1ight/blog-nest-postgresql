import { Module } from '@nestjs/common';
import { EmailConfig } from './email.config';
import { EmailAdapter } from './email.adapter';
import { EmailManager } from './email.manager';

@Module({
  providers: [EmailConfig, EmailAdapter, EmailManager],
})
export class EmailModule {}
