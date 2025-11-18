import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { UserDocumentModel } from '../models/user-document.model';
import { UserInputModel } from '../models/user-input.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(
    { login, email, createdAt, password }: UserInputModel,
    transactionQueryRunner: QueryRunner,
  ): Promise<number> {
    const result = (await transactionQueryRunner.query(
      `
        INSERT INTO public.users("login", "email", "password", "createdAt")
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `,
      [login, email, password, createdAt],
    )) as { id: number }[];

    return result[0]?.id;
  }

  async isUserExistByLogin(login: string): Promise<boolean> {
    const result: UserDocumentModel[] = await this.dataSource.query(
      `
    SELECT * FROM public.users WHERE login = $1`,
      [login],
    );

    return result.length > 0;
  }

  async isUserExistByEmail(email: string): Promise<boolean> {
    const result: UserDocumentModel[] = await this.dataSource.query(
      `
    SELECT * FROM public.users WHERE email = $1`,
      [email],
    );

    return result.length > 0;
  }
}
