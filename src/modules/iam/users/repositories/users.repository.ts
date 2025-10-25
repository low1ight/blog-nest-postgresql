import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserInsertType } from '../types/create.user.insert.type';

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
}
