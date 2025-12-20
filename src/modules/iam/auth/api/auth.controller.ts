import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { RtUser } from '../../../../core/decorators/refresh-token-user.param.decorator';
import type { AccessTokenPayloadModel } from '../../../../core/dto/access-token-payload.model';
import type { RefreshTokenPayloadModel } from '../../../../core/dto/refresh-token-payload.model';
import { UsersQueryRepository } from '../../users/infrastructure/users.query.repository';
import { JwtRefreshAuthGuard } from '../../../../core/guards/jwt-refresh-auth.guard';
import { PasswordRecoveryDto } from './input-dto/password-recovery.dto';
import { NewPasswordDto } from './input-dto/new-password.dto';
import { UserMeViewModel } from '../../users/api/view-dto/user-me.view.model';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from '../application/use-cases/registration.use-case';
import { LoginCommand } from '../application/use-cases/login.use-case';
import { TokensPair } from '../providers/jwt/token.service';
import { LogoutCommand } from '../application/use-cases/logout.use-case';
import { RefreshTokenCommand } from '../application/use-cases/refresh-token.use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery.use-case';
import { SetNewPasswordCommand } from '../application/use-cases/set-new-password.use-case';
import { RegistrationEmailResendingCommand } from '../application/use-cases/registration-email-resending.use-case';
import { RegistrationEmailResendingDto } from './input-dto/registration-email-resending.dto';
import { RegistrationConfirmationDto } from './input-dto/registration-confirmation.dto';
import { RegistrationConfirmationCommand } from '../application/use-cases/email-confirmation.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    const result: ResultType<null, ResultInputError> =
      await this.commandBus.execute(new RegistrationCommand(dto));

    if (result.isSuccessful) return result.content;

    throwExceptionFromCustomErr(result.error);
  }

  @Post('registration-email-resending')
  async registrationEmailResending(@Body() dto: RegistrationEmailResendingDto) {
    const result: ResultType<null, ResultInputError> =
      await this.commandBus.execute(
        new RegistrationEmailResendingCommand(dto.email),
      );

    if (!result.isSuccessful) return throwExceptionFromCustomErr(result.error);

    return;
  }

  @Post('registration-confirmation')
  async registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {
    const result: ResultType<null, ResultInputError> =
      await this.commandBus.execute(
        new RegistrationConfirmationCommand(dto.code),
      );

    if (!result.isSuccessful) return throwExceptionFromCustomErr(result.error);

    return;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: UserLoginModel,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = req.ip || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    const { accessToken, refreshToken }: TokensPair =
      await this.commandBus.execute(new LoginCommand(user, ip, userAgent));

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@RtUser() user: RefreshTokenPayloadModel) {
    await this.commandBus.execute(new LogoutCommand(user.deviceId));
    return;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @RtUser() user: RefreshTokenPayloadModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken }: TokensPair =
      await this.commandBus.execute(
        new RefreshTokenCommand(user.id, user.deviceId),
      );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('me')
  async me(
    @AtUser() { id }: AccessTokenPayloadModel,
  ): Promise<UserMeViewModel> {
    return await this.userQueryRepository.getUserMe(id);
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() { email }: PasswordRecoveryDto) {
    await this.commandBus.execute(new PasswordRecoveryCommand(email));
    return;
  }

  @Post('new-password')
  async newPassword(@Body() dto: NewPasswordDto) {
    const result: boolean = await this.commandBus.execute(
      new SetNewPasswordCommand(dto),
    );
    if (!result)
      throw new BadRequestException('RecoveryCode is incorrect or expired');

    return;
  }
}
