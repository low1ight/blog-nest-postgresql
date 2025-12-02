import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserLoginModel } from '../dto/user-login.model';
import { Request } from 'express';
import { AccessTokenPayloadModel } from '../dto/access-token-payload.model';

export const AtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessTokenPayloadModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: UserLoginModel = request?.user as AccessTokenPayloadModel;

    if (!user) throw Error('User not found! Set access token guard!');

    return user;
  },
);
