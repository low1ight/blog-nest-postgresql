import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PasswordHashConfig } from './password-hash.config';

@Injectable()
export class PasswordHashService {
  constructor(private readonly passwordHashConfig: PasswordHashConfig) {}

  async hash(password: string) {
    return bcrypt.hash(password, this.passwordHashConfig.saltRounds);
  }
}
