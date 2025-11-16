import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResultInputError } from '../../../../common/helpers/result/result-error';
import { PasswordHashService } from '../../../../common/security/password-hash.service';
import { UserInputModel } from '../models/user-input.model';
import { UsersConfirmationRepository } from '../repositories/users-confirmation.repository';
import { UsersPasswordRecoveryRepository } from '../repositories/users-password-recovery.repository';
import { Result } from '../../../../common/helpers/result/result';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly userConfirmationRepository: UsersConfirmationRepository,
    private readonly userPasswordRecoveryRepository: UsersPasswordRecoveryRepository,
  ) {}

  async creatUser({ login, password, email }: CreateUserDto) {
    const isUserLoginExist =
      await this.usersRepository.isUserExistByLogin(login);
    const isUserEmailExist =
      await this.usersRepository.isUserExistByEmail(email);

    if (isUserLoginExist)
      return Result.fail<ResultInputError>(
        new ResultInputError('user already exist', 'user'),
      );

    if (isUserEmailExist)
      return Result.fail<ResultInputError>(
        new ResultInputError('email already exist', 'email'),
      );

    const userInputModel: UserInputModel = {
      login,
      password: await this.passwordHashService.hash(password),
      email,
      createdAt: new Date().toISOString(),
    };

    const userId: number =
      await this.usersRepository.createUser(userInputModel);

    await this.userConfirmationRepository.createUserConfirmation({
      userId,
      isConfirmed: false,
      confirmationCode: null,
      codeExpirationDate: null,
    });

    await this.userPasswordRecoveryRepository.createPasswordRecoveryForUser({
      userId,
      recoveryCode: null,
      codeExpirationDate: null,
    });

    return Result.ok();
  }
}
