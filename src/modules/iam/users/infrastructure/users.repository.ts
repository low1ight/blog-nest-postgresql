import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { UserDocumentModel } from '../dto/user-document.model';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(
    { login, email, createdAt, password }: CreateUserDto,
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

  async getUserByEmailOrLogin(
    loginOrEmail: string,
  ): Promise<UserDocumentModel | null> {
    const user: UserDocumentModel[] | [] = await this.dataSource.query(
      `
    SELECT id,login,email,password,"createdAt" FROM public.users WHERE login = $1 OR email = $1
    `,
      [loginOrEmail],
    );

    return user[0] || null;
  }

  async updateUserPasswordById(id: number, password: string) {
    await this.dataSource.query(
      `
    UPDATE public.users
    SET "password"=$2
    WHERE "id"=$1`,
      [id, password],
    );
  }

  async getUserById(userId: number): Promise<UserDocumentModel | null> {
    const user: UserDocumentModel[] | [] = await this.dataSource.query(
      `
    SELECT id,login,email,password,"createdAt" FROM public.users WHERE id = $1 
    `,
      [userId],
    );

    return user[0] || null;
  }
}
