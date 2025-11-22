import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginUserPayloadModel } from '../../modules/iam/auth/types/login-user-payload.model';
import { Request } from 'express';
import { RefreshTokenPayloadModel } from '../../modules/iam/auth/types/refresh-token-payload.model';

export const RtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RefreshTokenPayloadModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: LoginUserPayloadModel =
      request?.user as RefreshTokenPayloadModel;

    if (!user) throw Error('User not found! Set refresh token guard!');

    return user;
  },
);
