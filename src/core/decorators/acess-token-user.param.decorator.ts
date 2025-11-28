import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginUserPayloadModel } from '../dto/login-user-payload.model';
import { Request } from 'express';
import { AccessTokenPayloadModel } from '../dto/access-token-payload.model';

export const AtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessTokenPayloadModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: LoginUserPayloadModel =
      request?.user as AccessTokenPayloadModel;

    if (!user) throw Error('User not found! Set access token guard!');

    return user;
  },
);
