import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../../devices/infrastructure/devices.repository';
import { randomUUID } from 'crypto';
import { TokenService, TokensPair } from '../../providers/jwt/token.service';

export class RefreshTokenCommand {
  constructor(
    public userId: number,
    public deviceId: number,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshToken implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute({
    userId,
    deviceId,
  }: RefreshTokenCommand): Promise<TokensPair> {
    const sessionId: string = randomUUID();
    const date = new Date().toISOString();

    await this.devicesRepository.updateDevice(deviceId, sessionId, date);

    return await this.tokenService.createTokensPair(
      userId,
      deviceId,
      sessionId,
    );
  }
}
