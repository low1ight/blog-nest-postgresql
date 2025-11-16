import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserPasswordRecoveryInputModel } from '../models/user-password-recovery-input.model';

@Injectable()
export class UsersPasswordRecoveryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createPasswordRecoveryForUser({
    userId,
    recoveryCode,
    codeExpirationDate,
  }: UserPasswordRecoveryInputModel) {
    await this.dataSource.query(
      `
    INSERT INTO public.users_password_recovery("userId","recoveryCode","codeExpirationDate")
    VALUES ($1,$2,$3)
    `,
      [userId, recoveryCode, codeExpirationDate],
    );
  }
}
