import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { ResultType } from '../../../../core/helpers/result/result';
import { throwExceptionFromCustomErr } from '../../../../core/exception/throw-exception-from-custom-err';
import { CurrentUser } from '../../../../core/decorators/current-user.param.decorator';
import type { LoginUserPayloadModel } from '../types/login-user-payload.model';
import type { Response } from 'express';
import { LocalAuthGuard } from '../../../../core/guards/local-auth.guard';
import { JwtAccessAuthGuard } from '../../../../core/guards/jwt-access-auth.guard';
import { AtUser } from '../../../../core/decorators/acess-token-user.param.decorator';
import type { AccessTokenPayloadModel } from '../types/access-token-payload.model';
import { UsersQueryRepository } from '../../users/repositories/users.query.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userQueryRepository: UsersQueryRepository,
  ) {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const result: ResultType<null, ResultInputError> =
      await this.authService.registration(dto);

    if (result.isSuccessful) return result.content;

    throwExceptionFromCustomErr(result.error);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: LoginUserPayloadModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  async me(@AtUser() { id }: AccessTokenPayloadModel) {
    return this.userQueryRepository.getUserMe(id);
  }
}
