import { Injectable } from '@nestjs/common';
import { UserConfirmationInputModel } from '../models/user-confirmation-input.model';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class UsersConfirmationRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createUserConfirmation(
    {
      userId,
      isConfirmed,
      confirmationCode,
      codeExpirationDate,
    }: UserConfirmationInputModel,
    transactionQueryRunner: QueryRunner,
  ) {
    await transactionQueryRunner.query(
      `
    INSERT INTO public.users_confirmation("userId","isConfirmed","confirmationCode","codeExpirationDate")
    VALUES ($1, $2, $3, $4)
    `,
      [userId, isConfirmed, confirmationCode, codeExpirationDate],
    );
  }
}
