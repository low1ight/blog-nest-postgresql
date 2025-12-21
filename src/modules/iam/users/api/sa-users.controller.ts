import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './input-dto/create-user.dto';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { ResultType } from '../../../../core/helpers/result/result';
import {
  ResultInputError,
  ResultNotFoundError,
} from '../../../../core/helpers/result/result-error';
import { throwExceptionFromCustomErr } from '../../../../core/exception/throw-exception-from-custom-err';
import { UsersQueryRepository } from '../infrastructure/query/users.query.repository';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';

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

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    console.log('lole');
    const result: ResultType<null, ResultNotFoundError> =
      await this.commandBus.execute(new DeleteUserCommand(id));

    if (!result.isSuccessful) {
      return throwExceptionFromCustomErr(result.error);
    }

    return;
  }
}
