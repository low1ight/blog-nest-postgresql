import { ResultInputError } from '../../../../../core/helpers/result/result-error';
import { Result } from '../../../../../core/helpers/result/result';
import { codeGenerator } from '../../../../../core/utils/code-generator';
import { createExpirationDate } from '../../../../../core/utils/create-expiration-date';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DataSource } from 'typeorm';
import { PasswordHashService } from '../../../users/providers/passwordHash/password-hash.service';
import { UsersConfirmationRepository } from '../../../users/infrastructure/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from '../../../users/infrastructure/users-password-recovery.repository';
import { CreateUserDto } from '../../../users/api/input-dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../../core/services/email/email.service';
import { AuthConfig } from '../../../auth.config';

export class RegistrationCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class Registration implements ICommandHandler<RegistrationCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userConfirmationRepository: UsersConfirmationRepository,
    private readonly userPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
    private readonly dataSource: DataSource,
    private readonly passwordHashService: PasswordHashService,
    private readonly authConfig: AuthConfig,
    private readonly emailManager: EmailService,
  ) {}

  async execute(command: RegistrationCommand) {
    const { login, email, password } = command.dto;

    const isUserLoginExist =
      await this.usersRepository.isUserExistByLogin(login);
    const isUserEmailExist =
      await this.usersRepository.isUserExistByEmail(email);

    // const [isUserLoginExist1, isUserEmailExist1] = await Promise.all([
    //   this.usersRepository.isUserExistByLogin(login),
    //   this.usersRepository.isUserExistByEmail(email),
    // ]);

    const inputError: ResultInputError = new ResultInputError();

    if (isUserLoginExist) inputError.addErr('login already exist', 'user');
    if (isUserEmailExist) inputError.addErr('email already exist', 'email');

    if (inputError.isExistErr()) return Result.fail(inputError);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const confirmationCode: string = codeGenerator();

    try {
      const userId: number = await this.usersRepository.createUser(
        {
          login,
          password: await this.passwordHashService.hash(password),
          email,
          createdAt: new Date().toISOString(),
        },
        queryRunner,
      );

      await this.userConfirmationRepository.createUserConfirmation(
        {
          userId,
          isConfirmed: this.authConfig.isUserAutoConfirmed,
          confirmationCode: confirmationCode,
          codeExpirationDate: createExpirationDate(60),
        },
        queryRunner,
      );

      await this.userPasswordRecoveryRepository.createPasswordRecoveryForUser(
        {
          userId,
          recoveryCode: null,
          codeExpirationDate: null,
        },
        queryRunner,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    this.emailManager.sendRegistrationCode(email, confirmationCode);

    return Result.ok();
  }
}
