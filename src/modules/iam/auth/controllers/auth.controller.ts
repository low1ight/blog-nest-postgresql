import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ResultInputError } from '../../../../common/helpers/result/result-error';
import { ResultType } from '../../../../common/helpers/result/result';
import { throwExceptionFromCustomErr } from '../../../../common/exception/throw-exception-from-custom-err';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUser() {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const result: ResultType<string, ResultInputError> =
      await this.authService.registration(dto);

    if (result.isSuccessful) return result.content;

    throwExceptionFromCustomErr(result.error);
  }
}
