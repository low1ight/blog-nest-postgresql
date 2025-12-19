import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { DevicesModule } from '../devices/devices.module';
import { Registration } from './application/use-cases/registration.use-case';
import { Login } from './application/use-cases/login.use-case';
import { Logout } from './application/use-cases/logout.use-case';
import { RefreshToken } from './application/use-cases/refresh-token.use-case';
import { PasswordRecovery } from './application/use-cases/password-recovery.use-case';
import { SetNewPassword } from './application/use-cases/set-new-password.use-case';

const userCases = [
  Registration,
  Login,
  Logout,
  RefreshToken,
  PasswordRecovery,
  SetNewPassword,
];

@Module({
  imports: [UsersModule, DevicesModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    ...userCases,
  ],
})
export class AuthModule {}
