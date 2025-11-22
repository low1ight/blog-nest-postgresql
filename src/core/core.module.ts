import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';
import { EmailModule } from './services/email/email.module';
import { PasswordHashModule } from './services/passwordHash/password-hash.module';
import { TokenModule } from './services/jwt/token.module';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Global()
@Module({
  imports: [EmailModule, PasswordHashModule, TokenModule],
  providers: [
    CoreConfig,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
    LocalAuthGuard,
  ],
  exports: [
    CoreConfig,
    EmailModule,
    PasswordHashModule,
    TokenModule,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
    LocalAuthGuard,
  ],
})
export class CoreModule {}
