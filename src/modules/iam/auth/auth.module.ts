import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../../shared/email/email.module';
import { PasswordHashModule } from '../../../shared/passwordHash/password-hash.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, EmailModule, PasswordHashModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
