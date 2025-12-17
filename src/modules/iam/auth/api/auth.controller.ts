import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserDto } from '../../users/api/input-dto/create-user.dto';
import { ResultInputError } from '../../../../core/helpers/result/result-error';
import { ResultType } from '../../../../core/helpers/result/result';
import { throwExceptionFromCustomErr } from '../../../../core/exception/throw-exception-from-custom-err';
import { CurrentUser } from '../../../../core/decorators/current-user.param.decorator';
import type { UserLoginModel } from '../../../../core/dto/user-login.model';
import type { Response, Request } from 'express';
import { LocalAuthGuard } from '../../../../core/guards/local-auth.guard';
import { JwtAccessAuthGuard } from '../../../../core/guards/jwt-access-auth.guard';
import { AtUser } from '../../../../core/decorators/acess-token-user.param.decorator';
import type { AccessTokenPayloadModel } from '../../../../core/dto/access-token-payload.model';
import type { RefreshTokenPayloadModel } from '../../../../core/dto/refresh-token-payload.model';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { JwtRefreshAuthGuard } from '../../../../core/guards/jwt-refresh-auth.guard';
import { RtUser } from '../../../../core/decorators/refresh-token-user.param.decorator';
import { PasswordRecoveryDto } from './input-dto/password-recovery.dto';

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
    @CurrentUser() user: UserLoginModel,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    const { accessToken, refreshToken } = await this.authService.login(
      user,
      ip,
      userAgent,
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async logout(@RtUser() user: RefreshTokenPayloadModel) {
    return this.authService.logout(user.deviceId);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @RtUser() user: RefreshTokenPayloadModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      user.id,
      user.deviceId,
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  async me(@Req() req: Request, @AtUser() { id }: AccessTokenPayloadModel) {
    return this.userQueryRepository.getUserMe(id);
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() { email }: PasswordRecoveryDto) {
    return this.authService.passwordRecovery(email);
  }
}
