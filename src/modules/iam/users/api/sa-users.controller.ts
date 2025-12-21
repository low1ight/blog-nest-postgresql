import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './input-dto/create-user.dto';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { ResultType } from '../../../../core/helpers/result/result';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { throwExceptionFromCustomErr } from '../../../../core/exception/throw-exception-from-custom-err';
import { UsersQueryRepository } from '../infrastructure/query/users.query.repository';

@Controller('sa/users')
export class SAUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const result: ResultType<number, ResultInputError> =
      await this.commandBus.execute(new CreateUserCommand(dto));

    if (!result.isSuccessful) {
      return throwExceptionFromCustomErr(result.error);
    }

    return await this.usersQueryRepository.getUserById(result.content);
  }
}
