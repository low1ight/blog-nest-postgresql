import { Module } from '@nestjs/common';
import { AuthController } from './auth/api/auth.controller';
import { AuthService } from './auth/application/auth.service';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { JwtAccessStrategy } from './auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';
import { Registration } from './auth/application/use-cases/registration.use-case';
import { Login } from './auth/application/use-cases/login.use-case';
import { Logout } from './auth/application/use-cases/logout.use-case';
import { RefreshToken } from './auth/application/use-cases/refresh-token.use-case';
import { PasswordRecovery } from './auth/application/use-cases/password-recovery.use-case';
import { SetNewPassword } from './auth/application/use-cases/set-new-password.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './devices/domain/device.entity';
import { DevicesController } from './devices/api/devices.controller';
import { User } from './users/domain/user.entity';
import { UserPasswordRecovery } from './users/domain/user-password-recovery.entity';
import { UserConfirmation } from './users/domain/user-confirmation.entity';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/query/users.query.repository';
import { UsersConfirmationRepository } from './users/infrastructure/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from './users/infrastructure/users-password-recovery.repository';
import { DevicesService } from './devices/application/devices.service';
import { DevicesRepository } from './devices/infrastructure/devices.repository';
import { DevicesQueryRepository } from './devices/infrastructure/devices.query.repository';
import { TerminateAllOtherDevices } from './devices/application/use-cases/terminate-all-other-devices.use-case';
import { TerminateSpecifiedDevice } from './devices/application/use-cases/terminate-specified-device.use-case';
import { AuthConfig } from './auth.config';
import { TokenService } from './auth/providers/jwt/token.service';
import { JwtModule } from '@nestjs/jwt';
import { PasswordHashService } from './users/providers/passwordHash/password-hash.service';
import { RegistrationEmailResending } from './auth/application/use-cases/registration-email-resending.use-case';
import { RegistrationConfirmation } from './auth/application/use-cases/email-confirmation.use-case';
import { SaUserController } from './users/api/sa-users.controller';
import { CreateUser } from './users/application/use-cases/create-user.use-case';
import { DeleteUser } from './users/application/use-cases/delete-user.use-case';
import { BasicStrategy } from './auth/strategies/basic.strategy';

const useCases = [
  Registration,
  Login,
  Logout,
  RefreshToken,
  PasswordRecovery,
  SetNewPassword,
  TerminateAllOtherDevices,
  TerminateSpecifiedDevice,
  RegistrationEmailResending,
  RegistrationConfirmation,
  CreateUser,
  DeleteUser,
];

@Module({
  controllers: [AuthController, DevicesController, SaUserController],
  imports: [
    JwtModule.registerAsync({
      useFactory: (authConfig: AuthConfig) => ({
        secret: authConfig.jwtSecret,
      }),
      inject: [AuthConfig],
    }),
    TypeOrmModule.forFeature([
      User,
      UserPasswordRecovery,
      UserConfirmation,
      Device,
    ]),
  ],
  providers: [
    TokenService,
    PasswordHashService,
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    BasicStrategy,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersConfirmationRepository,
    UsersPasswordRecoveryRepository,
    DevicesService,
    DevicesRepository,
    DevicesQueryRepository,
    ...useCases,
  ],
})
export class AuthModule {}
