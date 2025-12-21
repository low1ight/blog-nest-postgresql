import { Result, ResultType } from '../../../../../core/helpers/result/result';
import { codeGenerator } from '../../../../../core/utils/code-generator';
import { createExpirationDate } from '../../../../../core/utils/create-expiration-date';
import { CreateUserDto } from '../../../users/api/input-dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../../core/services/email/email.service';
import { AuthConfig } from '../../../auth.config';
import { UsersService } from '../../../users/application/users.service';
import { ResultInputError } from '../../../../../core/helpers/result/result-error';

export class RegistrationCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class Registration implements ICommandHandler<RegistrationCommand> {
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly usersService: UsersService,
    private readonly emailManager: EmailService,
  ) {}

  async execute(
    command: RegistrationCommand,
  ): Promise<ResultType<null, ResultInputError>> {
    const confirmationCode = codeGenerator();
    const expirationDate = createExpirationDate(60);
    const isConfirmed = this.authConfig.isUserAutoConfirmed;

    const result: ResultType<null, ResultInputError> =
      await this.usersService.createUser(
        command.dto,
        confirmationCode,
        expirationDate,
        isConfirmed,
      );

    if (!result.isSuccessful) {
      return result;
    }

    this.emailManager.sendRegistrationCode(command.dto.email, confirmationCode);

    return Result.ok();
  }
}
