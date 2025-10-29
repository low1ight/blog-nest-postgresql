import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserInsertType } from '../types/create-user.insert.type';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Result, ResultType } from '../../../../common/helpers/Result';
import { ResultInputError } from '../../../../common/exception/exception-filter/Error';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async creatUser({
    login,
    password,
    email,
  }: CreateUserDto): Promise<ResultType<string, ResultInputError>> {
    const isUserLoginExist =
      await this.usersRepository.isUserExistByLogin(login);
    const isUserEmailExist =
      await this.usersRepository.isUserExistByEmail(email);

    if (isUserLoginExist)
      return Result.fail<ResultInputError>(
        new ResultInputError('user already exist', 'user'),
      );

    if (isUserEmailExist)
      return Result.fail<ResultInputError>(
        new ResultInputError('email already exist', 'email'),
      );

    const userInputModel: CreateUserInsertType = {
      login,
      password,
      email,
      createdAt: new Date().toISOString(),
    };

    await this.usersRepository.createUser(userInputModel);

    return Result.ok('succssful created');
  }
}
