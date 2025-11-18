import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../../shared/email/email.module';

@Module({
  imports: [UsersModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
