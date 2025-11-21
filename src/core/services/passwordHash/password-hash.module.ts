import { Module } from '@nestjs/common';
import { PasswordHashConfig } from './password-hash.config';
import { PasswordHashService } from './password-hash.service';

@Module({
  providers: [PasswordHashConfig, PasswordHashService],
  exports: [PasswordHashService],
})
export class PasswordHashModule {}
