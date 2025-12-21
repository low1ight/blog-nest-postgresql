import { Result, ResultType } from '../../../../../core/helpers/result/result';
import { CreateUserDto } from '../../api/input-dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';
import { ResultInputError } from '../../../../../core/helpers/result/result-error';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUser implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<ResultType<number, ResultInputError>> {
    const result: ResultType<number, ResultInputError> =
      await this.usersService.createUser(command.dto, null, null, true);

    if (!result.isSuccessful) {
      return result;
    }

    return Result.ok(result.content);
  }
}
