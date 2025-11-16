import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ResultInputError } from '../../../../common/helpers/result/result-error';
import { ResultType } from '../../../../common/helpers/result/result';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUser() {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const result: ResultType<null, ResultInputError> =
      await this.authService.registration(dto);
    if (!result.isSuccessful)
      throw new BadRequestException([result.error.message]);
    return result.content;
  }
}
