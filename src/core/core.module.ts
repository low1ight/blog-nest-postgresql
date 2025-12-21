import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './config/core.config';
import { EmailModule } from './services/email/email.module';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthConfig } from '../modules/iam/auth.config';
import { BasicAuthGuard } from './guards/basic-auth.guard';

@Global()
@Module({
  imports: [EmailModule],
  providers: [
    CoreConfig,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
    BasicAuthGuard,
    LocalAuthGuard,
    AuthConfig,
  ],
  exports: [
    CoreConfig,
    AuthConfig,
    EmailModule,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
    LocalAuthGuard,
  ],
})
export class CoreModule {}
