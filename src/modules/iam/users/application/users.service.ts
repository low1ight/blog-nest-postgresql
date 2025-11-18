import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResultInputError } from '../../../../common/helpers/result/result-error';
import { PasswordHashService } from '../../../../common/security/password-hash.service';
import { UsersConfirmationRepository } from '../repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from '../repositories/users-password-recovery.repository';
import { Result } from '../../../../common/helpers/result/result';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
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

    if (isUserLoginExist) inputError.addErr('user already exist', 'user');
    if (isUserEmailExist) inputError.addErr('email already exist', 'email');

    if (inputError.isExistErr()) return Result.fail(inputError);

    //create transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
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
          isConfirmed: false,
          confirmationCode: null,
          codeExpirationDate: null,
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

    return Result.ok();
  }
}
