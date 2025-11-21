import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';
import { EmailModule } from './services/email/email.module';
import { PasswordHashModule } from './services/passwordHash/password-hash.module';

@Global()
@Module({
  imports: [EmailModule, PasswordHashModule],
  providers: [CoreConfig],
  exports: [CoreConfig, EmailModule, PasswordHashModule],
})
export class CoreModule {}
