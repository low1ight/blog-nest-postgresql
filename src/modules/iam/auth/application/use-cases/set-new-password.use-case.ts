import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPasswordRecovery } from '../../../users/domain/user-password-recovery.entity';
import { isDateExpired } from '../../../../../core/utils/is-date-expired';
import { UsersPasswordRecoveryRepository } from '../../../users/infrastructure/users-password-recovery.repository';
import { PasswordHashService } from '../../../../../core/services/passwordHash/password-hash.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { NewPasswordDto } from '../../api/input-dto/new-password.dto';

export class SetNewPasswordCommand {
  constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPassword implements ICommandHandler<SetNewPasswordCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(command: SetNewPasswordCommand) {
    const { recoveryCode, newPassword } = command.dto;
    const userPasswordRecovery: UserPasswordRecovery | null =
      await this.userPasswordRecoveryRepository.getByRecoveryCode(recoveryCode);

    if (!userPasswordRecovery) return false;

    if (isDateExpired(userPasswordRecovery.codeExpirationDate)) return false;

    const newPasswordHash = await this.passwordHashService.hash(newPassword);

    await this.usersRepository.updateUserPasswordById(
      userPasswordRecovery.userId,
      newPasswordHash,
    );

    return true;
  }
}
