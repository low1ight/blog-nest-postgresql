import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { Result } from '../../../../../core/helpers/result/result';
import { ResultNotFoundError } from '../../../../../core/helpers/result/result-error';

export class DeleteUserCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUser implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.usersRepository.getUserById(command.userId);
    if (!user) return Result.fail(new ResultNotFoundError());

    await this.usersRepository.deleteUserById(command.userId);

    return Result.ok();
  }
}
