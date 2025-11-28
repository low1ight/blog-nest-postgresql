import { Injectable } from '@nestjs/common';
import { CreateUserConfirmationDto } from '../dto/create-user-confirmation.dto';
import { QueryRunner } from 'typeorm';

@Injectable()
export class UsersConfirmationRepository {
  constructor() {}

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
    INSERT INTO public.users_confirmation("userId","isConfirmed","confirmationCode","codeExpirationDate")
    VALUES ($1, $2, $3, $4)
    `,
      [userId, isConfirmed, confirmationCode, codeExpirationDate],
    );
  }
}
