import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../api/input-dto/create-user.dto';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { PasswordHashService } from '../../../../core/services/passwordHash/password-hash.service';
import { UsersConfirmationRepository } from '../repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from '../repositories/users-password-recovery.repository';
import { Result } from '../../../../core/helpers/result/result';
import { DataSource } from 'typeorm';
import { UsersConfig } from '../config/users.config';
import { codeGenerator } from '../../../../core/utils/code-generator';
import { createExpirationDate } from '../../../../core/utils/create-expiration-date';

@Injectable()
export class UsersService {
  constructor(
    private readonly userConfig: UsersConfig,
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly userConfirmationRepository: UsersConfirmationRepository,
    private readonly userPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async creatUser({ login, password, email }: CreateUserDto) {
    const isUserLoginExist =
      await this.usersRepository.isUserExistByLogin(login);
    const isUserEmailExist =
      await this.usersRepository.isUserExistByEmail(email);

    const inputError: ResultInputError = new ResultInputError();

    if (isUserLoginExist) inputError.addErr('login already exist', 'user');
    if (isUserEmailExist) inputError.addErr('email already exist', 'email');

    if (inputError.isExistErr()) return Result.fail(inputError);

    //create transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    //generate user confirmation code
    const confirmationCode: string = codeGenerator();
    try {
      //create user
      const userId: number = await this.usersRepository.createUser(
        {
          login,
          password: await this.passwordHashService.hash(password),
          email,
          createdAt: new Date().toISOString(),
        },
        queryRunner,
      );

      //create user-confirmation
      await this.userConfirmationRepository.createUserConfirmation(
        {
          userId,
          isConfirmed: this.userConfig.isUserAutoConfirmed,
          confirmationCode: confirmationCode,
          codeExpirationDate: createExpirationDate(60),
        },
        queryRunner,
      );

      //create user-pass-recovery
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

    return Result.ok(confirmationCode);
  }
}
