import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokenConfig } from '../../../../core/services/jwt/token.config';
import { RefreshTokenPayloadModel } from '../../../../core/dto/refresh-token-payload.model';
import { Request } from 'express';

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
  constructor(tokenConfig: TokenConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: tokenConfig.jwtSecret,
    });
  }

  validate(payload: RefreshTokenPayloadModel): RefreshTokenPayloadModel {
    return payload;
  }
}
