import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {
  async hash(password: string) {
    return bcrypt.hash(password, 10);
  }
}
