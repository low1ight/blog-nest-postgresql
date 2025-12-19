import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersConfirmationRepository } from './infrastructure/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from './infrastructure/users-password-recovery.repository';
import { UsersConfig } from './config/users.config';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserPasswordRecovery } from './domain/user-password-recovery.entity';
import { UserConfirmation } from './domain/user-confirmation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPasswordRecovery, UserConfirmation]),
  ],
  providers: [
    UsersConfig,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersConfirmationRepository,
    UsersPasswordRecoveryRepository,
  ],
  exports: [
    UsersService,
    UsersRepository,
    UsersPasswordRecoveryRepository,
    UsersConfirmationRepository,
    UsersQueryRepository,
    UsersConfig,
  ],
})
export class UsersModule {}
