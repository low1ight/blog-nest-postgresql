import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginUserPayloadModel } from '../types/login-user-payload.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<LoginUserPayloadModel> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Wrong login or password');
    }
    return { id: user.id };
  }
}
