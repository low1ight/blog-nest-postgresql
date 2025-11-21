import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadModel } from '../../modules/iam/auth/types/user-payload.model';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayloadModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: UserPayloadModel = request?.user as UserPayloadModel;

    if (!user) throw Error('User not found! Set local auth guard!');

    return user;
  },
);
