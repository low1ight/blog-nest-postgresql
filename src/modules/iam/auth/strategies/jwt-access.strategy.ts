import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokenConfig } from '../../../../core/services/jwt/token.config';
import { AccessTokenPayloadModel } from '../../../../core/dto/access-token-payload.model';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(tokenConfig: TokenConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: tokenConfig.jwtSecret,
    });
  }

  validate(payload: AccessTokenPayloadModel): AccessTokenPayloadModel {
    return payload;
  }
}
