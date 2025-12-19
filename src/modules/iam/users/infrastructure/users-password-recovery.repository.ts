import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateUserPasswordRecoveryDto } from '../dto/create-user-password-recovery.dto';
import { UserPasswordRecovery } from '../domain/user-password-recovery.entity';

@Injectable()
export class UsersPasswordRecoveryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createPasswordRecoveryForUser(
    { userId, recoveryCode, codeExpirationDate }: CreateUserPasswordRecoveryDto,
    transactionQueryRunner: QueryRunner,
  ) {
    await transactionQueryRunner.query(
      `
          INSERT INTO public.users_password_recovery("userId", "recoveryCode", "codeExpirationDate")
          VALUES ($1, $2, $3)
      `,
      [userId, recoveryCode, codeExpirationDate],
    );
  }

  async updatePasswordRecovery(
    userId: number,
    recoveryCode: string,
    codeExpirationDate: string,
  ) {
    await this.dataSource.query(
      `
        UPDATE public.users_password_recovery
        SET "recoveryCode"=$2,
            "codeExpirationDate"=$3
        WHERE "userId" = $1;`,
      [userId, recoveryCode, codeExpirationDate],
    );
  }

  async getByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserPasswordRecovery | null> {
    const result: UserPasswordRecovery[] = await this.dataSource.query(
      `
    SELECT * FROM public.users_password_recovery WHERE "recoveryCode" = $1
    `,
      [recoveryCode],
    );
    return result[0] || null;
  }
}
