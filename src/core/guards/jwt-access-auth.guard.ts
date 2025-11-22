import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayloadModel } from '../../modules/iam/auth/types/access-token-payload.model';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
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
        throw new UnauthorizedException(
          'no access token in header (Authorization: Bearer)',
        );
      }
      throw new UnauthorizedException(info);
    }
    return user as TUser;
  }
}
