import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Result, ResultType } from '../../../../common/helpers/result/result';
import { ResultInputError } from '../../../../common/helpers/result/result-error';
import { EmailManager } from '../../../../shared/email/email.manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailManager: EmailManager,
  ) {}

  async registration(dto: CreateUserDto) {
    const result: ResultType<string, ResultInputError> =
      await this.usersService.creatUser(dto);

    if (!result.isSuccessful) return result;

    this.emailManager.sendRegistrationCode(dto.email, result.content);

    return Result.ok();
  }
}
