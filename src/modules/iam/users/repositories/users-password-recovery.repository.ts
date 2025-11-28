import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateUserPasswordRecoveryDto } from '../dto/create-user-password-recovery.dto';

@Injectable()
export class UsersPasswordRecoveryRepository {
  constructor() {}

  async createPasswordRecoveryForUser(
    { userId, recoveryCode, codeExpirationDate }: CreateUserPasswordRecoveryDto,
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
