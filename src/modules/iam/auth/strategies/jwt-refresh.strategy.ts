import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenConfig } from '../../../../core/services/jwt/token.config';
import { RefreshTokenPayloadModel } from '../../../../core/dto/refresh-token-payload.model';
import { Request } from 'express';
import { DevicesService } from '../../devices/application/devices.service';

type RequestWithCookie = Request & {
  cookies?: {
    refreshToken?: string;
  };
};

const getTokenFromCookie = (req: RequestWithCookie): string | null => {
  return req?.cookies?.refreshToken ?? null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    tokenConfig: TokenConfig,
    private readonly devicesService: DevicesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: tokenConfig.jwtSecret,
    });
  }

  async validate(
    payload: RefreshTokenPayloadModel,
  ): Promise<RefreshTokenPayloadModel> {
    const device = await this.devicesService.getDeviceById(payload.deviceId);
    if (!device || device.sessionId !== payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
