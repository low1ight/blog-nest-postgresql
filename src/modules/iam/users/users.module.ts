import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersConfirmationRepository } from './repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from './repositories/users-password-recovery.repository';
import { UsersConfig } from './config/users.config';

@Module({
  providers: [
    UsersConfig,
    UsersService,
    UsersRepository,
    UsersConfirmationRepository,
    UsersPasswordRecoveryRepository,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
