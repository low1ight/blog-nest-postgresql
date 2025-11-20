import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Result, ResultType } from '../../../../common/helpers/result/result';
import { ResultInputError } from '../../../../common/helpers/result/result-error';
import { EmailManager } from '../../../../shared/email/email.manager';
import { UsersRepository } from '../../users/repositories/users.repository';
import { PasswordHashService } from '../../../../shared/passwordHash/password-hash.service';
import { UserDocumentModel } from '../../users/models/user-document.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailManager: EmailManager,
    private readonly userRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async registration(dto: CreateUserDto) {
    const result: ResultType<string, ResultInputError> =
      await this.usersService.creatUser(dto);

    if (!result.isSuccessful) return result;

    this.emailManager.sendRegistrationCode(dto.email, result.content);

    return Result.ok();
  }

  async validateUser(loginOrEmail: string, password: string) {
    const user: UserDocumentModel | null =
      await this.userRepository.getUserByEmailOrLogin(loginOrEmail);

    if (!user) return null;

    const isPasswordMatch = await this.passwordHashService.compare(
      password,
      user.password,
    );

    if (!isPasswordMatch) return null;

    return user;
  }
}
