import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserInsertType } from '../types/create.user.insert.type';
import { CreateUserDto } from '../dto/CreateUserDto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async creatUser({ login, password, email }: CreateUserDto) {
    const userInputModel: CreateUserInsertType = {
      login,
      password,
      email,
      createdAt: new Date().toISOString(),
    };

    return this.usersRepository.createUser(userInputModel);
  }
}
