import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { createExpirationDate } from '../../../../../core/utils/create-expiration-date';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersPasswordRecoveryRepository } from '../../../users/infrastructure/users-password-recovery.repository';
import { EmailService } from '../../../../../core/services/email/email.service';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecovery
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
    private readonly emailManager: EmailService,
  ) {}

  async execute({ email }: PasswordRecoveryCommand) {
    const user = await this.usersRepository.getUserByEmailOrLogin(email);
    if (!user) return;

    const recoveryCode: string = randomUUID();
    //todo add recovery code time env
    const expirationDate = createExpirationDate(15);

    await this.usersPasswordRecoveryRepository.updatePasswordRecovery(
      user.id,
      recoveryCode,
      expirationDate,
    );

    this.emailManager.sendPasswordRecoveryCode(email, recoveryCode);
  }
}
