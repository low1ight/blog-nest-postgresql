import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { PasswordHashService } from '../providers/passwordHash/password-hash.service';
import { UsersPasswordRecoveryRepository } from '../infrastructure/users-password-recovery.repository';
import { CreateUserDto } from '../api/input-dto/create-user.dto';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { Result } from '../../../../core/helpers/result/result';
import { DataSource } from 'typeorm';
import { UsersConfirmationRepository } from '../infrastructure/users-confirmation.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userConfirmationRepository: UsersConfirmationRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly userPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(
    { login, email, password }: CreateUserDto,
    userConfirmationCode: string | null,
    confirmationCodeExpirationDate: string | null,
    isUserConfirmed: boolean,
  ) {
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
    let userId: number;

    try {
      userId = await this.usersRepository.createUser(
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
          isConfirmed: isUserConfirmed,
          confirmationCode: userConfirmationCode,
          codeExpirationDate: confirmationCodeExpirationDate,
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

    return Result.ok(userId);
  }
}
