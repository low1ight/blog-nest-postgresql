import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';
import { EmailModule } from './services/email/email.module';
import { PasswordHashModule } from './services/passwordHash/password-hash.module';
import { TokenModule } from './services/jwt/token.module';

@Global()
@Module({
  imports: [EmailModule, PasswordHashModule, TokenModule],
  providers: [CoreConfig],
  exports: [CoreConfig, EmailModule, PasswordHashModule, TokenModule],
})
export class CoreModule {}
