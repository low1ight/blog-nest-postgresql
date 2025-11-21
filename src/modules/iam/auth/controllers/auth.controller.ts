import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { ResultType } from '../../../../core/helpers/result/result';
import { throwExceptionFromCustomErr } from '../../../../core/exception/throw-exception-from-custom-err';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../../../core/decorators/current-user.param.decorator';
import type { UserPayloadModel } from '../types/user-payload.model';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUser() {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const result: ResultType<null, ResultInputError> =
      await this.authService.registration(dto);

    if (result.isSuccessful) return result.content;

    throwExceptionFromCustomErr(result.error);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @CurrentUser() user: UserPayloadModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }
}
