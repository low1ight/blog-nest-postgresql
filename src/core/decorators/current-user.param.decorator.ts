import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginUserPayloadModel } from '../dto/login-user-payload.model';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LoginUserPayloadModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: LoginUserPayloadModel = request?.user as LoginUserPayloadModel;

    if (!user) throw Error('User not found! Set local auth guard!');

    return user;
  },
);
