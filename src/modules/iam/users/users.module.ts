import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './repositories/users.repository';
import { PasswordHashService } from '../../../shared/passwordHash/password-hash.service';
import { UsersConfirmationRepository } from './repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from './repositories/users-password-recovery.repository';

@Module({
  controllers: [],
  providers: [
    UsersService,
    PasswordHashService,
    UsersRepository,
    UsersConfirmationRepository,
    UsersPasswordRecoveryRepository,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
