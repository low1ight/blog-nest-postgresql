import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthConfig } from '../../../auth.config';

@Injectable()
export class PasswordHashService {
  constructor(private readonly authConfig: AuthConfig) {}

  async hash(password: string) {
    return bcrypt.hash(password, this.authConfig.saltRounds);
  }

  async compare(currentPassword: string, correctHashedPassword: string) {
    return bcrypt.compare(currentPassword, correctHashedPassword);
  }
}
