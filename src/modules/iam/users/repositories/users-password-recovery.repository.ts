import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { UserPasswordRecoveryInputModel } from '../models/user-password-recovery-input.model';

@Injectable()
export class UsersPasswordRecoveryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createPasswordRecoveryForUser(
    {
      userId,
      recoveryCode,
      codeExpirationDate,
    }: UserPasswordRecoveryInputModel,
    transactionQueryRunner: QueryRunner,
  ) {
    await transactionQueryRunner.query(
      `
    INSERT INTO public.users_password_recovery("userId","recoveryCode","codeExpirationDate")
    VALUES ($1,$2,$3)
    `,
      [userId, recoveryCode, codeExpirationDate],
    );
  }
}
