import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersConfirmationRepository } from '../../../users/infrastructure/users-confirmation.repository';
import { UserConfirmation } from '../../../users/domain/user-confirmation.entity';
import { Result } from '../../../../../core/helpers/result/result';
import { ResultInputError } from '../../../../../core/helpers/result/result-error';
import { isDateExpired } from '../../../../../core/utils/is-date-expired';

export class RegistrationConfirmationCommand {
  constructor(public confirmationCode: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmation
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(
    private readonly usersConfirmationRepository: UsersConfirmationRepository,
  ) {}

  async execute({ confirmationCode }: RegistrationConfirmationCommand) {
    const userConfirmation: UserConfirmation | null =
      await this.usersConfirmationRepository.getUserConfirmationByConfirmationCode(
        confirmationCode,
      );

    if (!userConfirmation) {
      return Result.fail(
        new ResultInputError('Invalid confirmation code', 'confirmationCode'),
      );
    }

    if (userConfirmation.isConfirmed) {
      return Result.fail(
        new ResultInputError('User already confirmed', 'confirmationCode'),
      );
    }

    if (isDateExpired(userConfirmation.codeExpirationDate)) {
      return Result.fail(
        new ResultInputError(
          'confirmation code is expired',
          'confirmationCode',
        ),
      );
    }

    await this.usersConfirmationRepository.confirmUserById(
      userConfirmation.userId,
    );

    return Result.ok();
  }
}
