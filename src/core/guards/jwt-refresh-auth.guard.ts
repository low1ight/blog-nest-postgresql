import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayloadModel } from '../dto/access-token-payload.model';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: AccessTokenPayloadModel | false,
    info: any,
  ) {
    if (err || !user) {
      const errInfo = info as { message?: string };
      if (errInfo?.message === 'No auth token') {
        throw new UnauthorizedException('no refresh token in cookie');
      }
      throw new UnauthorizedException(info);
    }
    return user as TUser;
  }
}
