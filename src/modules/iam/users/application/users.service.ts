import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserInsertType } from '../types/create.user.insert.type';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async creatUser(dto: { email: string; password: string; login: string }) {
    const userInputModel: CreateUserInsertType = {
      login: dto.login,
      password: dto.password,
      email: dto.email,
      createdAt: new Date().toISOString(),
    };

    return this.usersRepository.createUser(userInputModel);
  }
}
