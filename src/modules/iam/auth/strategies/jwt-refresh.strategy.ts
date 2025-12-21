import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenPayloadModel } from '../../../../core/dto/auth/refresh-token-payload.model';
import { Request } from 'express';
import { DevicesService } from '../../devices/application/devices.service';
import { AuthConfig } from '../../auth.config';

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
    authConfig: AuthConfig,
    private readonly devicesService: DevicesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
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
