import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Result, ResultType } from '../../../../core/helpers/result/result';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { EmailService } from '../../../../core/services/email/email.service';
import { UsersRepository } from '../../users/repositories/users.repository';
import { PasswordHashService } from '../../../../core/services/passwordHash/password-hash.service';
import { UserDocumentModel } from '../../users/models/user-document.model';
import { LoginUserPayloadModel } from '../types/login-user-payload.model';
import { TokenService } from '../../../../core/services/jwt/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailManager: EmailService,
    private readonly userRepository: UsersRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(dto: CreateUserDto) {
    const result: ResultType<string, ResultInputError> =
      await this.usersService.creatUser(dto);

    if (!result.isSuccessful) return result;

    this.emailManager.sendRegistrationCode(dto.email, result.content);

    return Result.ok();
  }

  async login(userPayloadModel: LoginUserPayloadModel) {
    return await this.tokenService.createTokensPair(userPayloadModel);
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
