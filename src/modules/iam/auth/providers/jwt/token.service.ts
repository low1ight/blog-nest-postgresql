import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt';
import { AuthConfig } from '../../../auth.config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly authConfig: AuthConfig,
  ) {}

  async createTokensPair(
    userId: number,
    deviceId: number,
    sessionId: string,
  ): Promise<TokensPair> {
    const atExpirationIn = this.authConfig.accessTokenExpirationTime;
    const rtExpirationIn = this.authConfig.refreshTokenExpirationTime;

    const at = await this.jwt.signAsync(
      { id: userId },
      { expiresIn: (atExpirationIn + 'm') as JwtSignOptions['expiresIn'] },
    );

    const rt = await this.jwt.signAsync(
      { id: userId, deviceId, sessionId },
      { expiresIn: (rtExpirationIn + 'd') as JwtSignOptions['expiresIn'] },
    );

    return { accessToken: at, refreshToken: rt };
  }
}

export type TokensPair = {
  accessToken: string;
  refreshToken: string;
};
