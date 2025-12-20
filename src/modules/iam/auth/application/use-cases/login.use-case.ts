import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserLoginModel } from '../../../../../core/dto/user-login.model';
import { DevicesService } from '../../../devices/application/devices.service';
import { TokenService, TokensPair } from '../../providers/jwt/token.service';

export class LoginCommand {
  constructor(
    public user: UserLoginModel,
    public ip: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class Login implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly deviceService: DevicesService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<TokensPair> {
    const { user, ip, userAgent } = command;

    const { id, sessionId } = await this.deviceService.createDevice(
      ip,
      userAgent,
      user.id,
    );

    return await this.tokenService.createTokensPair(user.id, id, sessionId);
  }
}
