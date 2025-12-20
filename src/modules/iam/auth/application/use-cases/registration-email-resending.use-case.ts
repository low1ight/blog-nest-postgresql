import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersConfirmationRepository } from '../../../users/infrastructure/users-confirmation.repository';
import { UserDocumentModel } from '../../../users/dto/user-document.model';
import { Result } from '../../../../../core/helpers/result/result';
import { ResultInputError } from '../../../../../core/helpers/result/result-error';
import { UserConfirmation } from '../../../users/domain/user-confirmation.entity';
import { codeGenerator } from '../../../../../core/utils/code-generator';
import { createExpirationDate } from '../../../../../core/utils/create-expiration-date';
import { EmailService } from '../../../../../core/services/email/email.service';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResending
  implements ICommandHandler<RegistrationEmailResendingCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersConfirmationRepository: UsersConfirmationRepository,
    private readonly emailManager: EmailService,
  ) {}

  async execute({ email }: RegistrationEmailResendingCommand) {
    const user: UserDocumentModel | null =
      await this.usersRepository.getUserByEmailOrLogin(email);
    if (!user)
      return Result.fail(new ResultInputError('Invalid email', 'email'));

    const userEmailConfirmation: UserConfirmation =
      await this.usersConfirmationRepository.getUserConfirmationById(user.id);

    if (userEmailConfirmation.isConfirmed) {
      return Result.fail(
        new ResultInputError('email already confirmed', 'email'),
      );
    }

    const newConfirmationCode: string = codeGenerator();
    const expirationDate = createExpirationDate(60);

    await this.usersConfirmationRepository.updateConfirmationCode(
      user.id,
      newConfirmationCode,
      expirationDate,
    );

    this.emailManager.sendRegistrationCode(email, newConfirmationCode);

    return Result.ok();
  }
}
