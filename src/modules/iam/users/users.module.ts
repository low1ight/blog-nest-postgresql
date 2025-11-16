import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './repositories/users.repository';
import { PasswordHashService } from '../../../common/security/password-hash.service';

@Module({
  controllers: [],
  providers: [UsersService, UsersRepository, PasswordHashService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
