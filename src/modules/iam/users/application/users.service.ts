import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserInsertType } from '../types/create-user.insert.type';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Result, ResultType } from '../../../../common/helpers/Result';
import {
  ErrorType,
  InputError,
  ResultError,
} from '../../../../common/exception/exception-filter/Error';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async creatUser({
    login,
    password,
    email,
  }: CreateUserDto): Promise<ResultType<string, InputError>> {
    const isUserLoginExist =
      await this.usersRepository.isUserExistByLogin(login);
    const isUserEmailExist =
      await this.usersRepository.isUserExistByEmail(email);

    if (isUserLoginExist)
      return Result.fail(
        ResultError.inputError('user already exist', 'user'),
        ErrorType.InvalidInput,
      );

    if (isUserEmailExist)
      return Result.fail(
        ResultError.inputError('email already exist', 'email'),
        ErrorType.InvalidInput,
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
