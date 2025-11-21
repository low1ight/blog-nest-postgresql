import { Injectable } from '@nestjs/common';
import { UserPayloadModel } from '../../../modules/iam/auth/types/user-payload.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService) {}

  async createTokensPair({ id }: UserPayloadModel): Promise<TokensPair> {
    const at = await this.jwt.signAsync({ id }, { expiresIn: '1d' });
    const rt = await this.jwt.signAsync({ id }, { expiresIn: '1d' });

    return { accessToken: at, refreshToken: rt };
  }
}

export type TokensPair = {
  accessToken: string;
  refreshToken: string;
};
