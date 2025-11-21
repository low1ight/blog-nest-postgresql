import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokenConfig } from '../../../../core/services/jwt/token.config';
import { RefreshTokenPayloadModel } from '../types/refresh-token-payload.model';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(tokenConfig: TokenConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: tokenConfig.jwtSecret,
    });
  }

  validate(payload: RefreshTokenPayloadModel): RefreshTokenPayloadModel {
    return payload;
  }
}
