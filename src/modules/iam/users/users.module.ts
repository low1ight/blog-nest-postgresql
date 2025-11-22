import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersConfirmationRepository } from './repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from './repositories/users-password-recovery.repository';
import { UsersConfig } from './config/users.config';
import { UsersQueryRepository } from './repositories/users.query.repository';

@Module({
  providers: [
    UsersConfig,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersConfirmationRepository,
    UsersPasswordRecoveryRepository,
  ],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
