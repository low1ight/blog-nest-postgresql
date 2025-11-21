import { Injectable } from '@nestjs/common';
import { IsNotEmpty, Min } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationMessage } from '../../config/config.validation.message';
import { ConfigValidationUtility } from '../../config/config.validation.utility';

@Injectable()
export class TokenConfig {
  @IsNotEmpty({ message: configValidationMessage('JWT_SECRET', 'any string') })
  jwtSecret: string;

  @Min(1, {
    message: configValidationMessage('JWT_ACCESS_TOKEN_EXPIRATION_TIME', '15'),
  })
  accessTokenExpirationTime: number;

  @Min(1, {
    message: configValidationMessage('JWT_REFRESH_TOKEN_EXPIRATION_TIME', '7'),
  })
  refreshTokenExpirationTime: number;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get('JWT_SECRET') || '';
    this.accessTokenExpirationTime = Number(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );
    this.refreshTokenExpirationTime = Number(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );
    ConfigValidationUtility.validate(this);
  }
}
