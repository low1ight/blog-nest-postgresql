import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserLoginModel } from '../dto/auth/user-login.model';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserLoginModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: UserLoginModel = request?.user as UserLoginModel;

    if (!user) throw Error('User not found! Set local auth guard!');

    return user;
  },
);
