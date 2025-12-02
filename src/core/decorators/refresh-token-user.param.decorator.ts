import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenPayloadModel } from '../dto/refresh-token-payload.model';

export const RtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RefreshTokenPayloadModel => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request?.user as RefreshTokenPayloadModel;

    if (!user) throw Error('User not found! Set refresh token guard!');

    return user;
  },
);
