import { Injectable } from '@nestjs/common';
import { CreateUserConfirmationDto } from '../dto/create-user-confirmation.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { UserConfirmation } from '../domain/user-confirmation.entity';

@Injectable()
export class UsersConfirmationRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createUserConfirmation(
    {
      userId,
      isConfirmed,
      confirmationCode,
      codeExpirationDate,
    }: CreateUserConfirmationDto,
    transactionQueryRunner: QueryRunner,
  ) {
    await transactionQueryRunner.query(
      `
    INSERT INTO public.users_confirmation( "userId", "isConfirmed", "confirmationCode", "codeExpirationDate")
    VALUES ($1, $2, $3, $4)
    `,
      [userId, isConfirmed, confirmationCode, codeExpirationDate],
    );
  }

  async getUserConfirmationById(userId: number) {
    const result: UserConfirmation[] = await this.dataSource.query(
      `
    SELECT "userId","isConfirmed","confirmationCode","codeExpirationDate" 
    FROM public.users_confirmation
    WHERE "userId"=$1;
    `,
      [userId],
    );

    return result[0] || null;
  }

  async updateConfirmationCode(
    userId: number,
    code: string,
    expirationDate: string,
  ) {
    const result: UserConfirmation[] = await this.dataSource.query(
      `
    UPDATE public.users_confirmation
    SET "confirmationCode"=$2, "codeExpirationDate"=$3
    WHERE "userId"=$1;
    `,
      [userId, code, expirationDate],
    );

    return result[0] || null;
  }
}
