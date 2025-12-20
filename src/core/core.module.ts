import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';
import { EmailModule } from './services/email/email.module';
import { PasswordHashModule } from './services/passwordHash/password-hash.module';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthConfig } from '../modules/iam/auth.config';

@Global()
@Module({
  imports: [EmailModule, PasswordHashModule],
  providers: [
    CoreConfig,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
    LocalAuthGuard,
    AuthConfig,
  ],
  exports: [
    CoreConfig,
    AuthConfig,
    EmailModule,
    PasswordHashModule,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
    LocalAuthGuard,
  ],
})
export class CoreModule {}
