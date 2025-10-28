import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserInsertType } from '../types/create-user.insert.type';
import { UserDocumentType } from '../types/user.document.type';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser({
    login,
    email,
    createdAt,
    password,
  }: CreateUserInsertType) {
    await this.dataSource.query(
      `
        INSERT INTO public.users("login", "email", "password", "createdAt")
        VALUES ($1, $2, $3, $4)
    `,
      [login, email, password, createdAt],
    );
  }

  async isUserExistByLogin(login: string): Promise<boolean> {
    const result: UserDocumentType[] = await this.dataSource.query(
      `
    SELECT * FROM public.users WHERE login = $1`,
      [login],
    );

    return result.length > 0;
  }

  async isUserExistByEmail(email: string): Promise<boolean> {
    const result: UserDocumentType[] = await this.dataSource.query(
      `
    SELECT * FROM public.users WHERE email = $1`,
      [email],
    );

    return result.length > 0;
  }
}
