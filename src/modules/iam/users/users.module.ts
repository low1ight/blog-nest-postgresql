import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersConfirmationRepository } from './repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from './repositories/users-password-recovery.repository';
import { UsersConfig } from './config/users.config';
import { UsersQueryRepository } from './repositories/users.query.repository';
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
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
