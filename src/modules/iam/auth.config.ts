import { Injectable } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, Min } from 'class-validator';
import {
  configValidationCorrectValueExample,
  configValidationMessage,
} from '../../core/config/config.validation.message';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../core/config/config.validation.utility';

@Injectable()
export class AuthConfig {
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

  @IsBoolean({
    message: configValidationMessage(
      'IS_USER_AUTO_CONFIRMED',
      configValidationCorrectValueExample.boolean,
    ),
  })
  isUserAutoConfirmed: boolean;

  @Min(1, { message: configValidationMessage('BCRYPT_SALT_ROUNDS', '10') })
  saltRounds: number;

  constructor(private configService: ConfigService) {
    this.isUserAutoConfirmed = ConfigValidationUtility.convertToBoolean(
      this.configService.get('IS_USER_AUTO_CONFIRMED'),
    ) as boolean;

    this.jwtSecret = this.configService.get('JWT_SECRET') || '';
    this.accessTokenExpirationTime = Number(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );
    this.refreshTokenExpirationTime = Number(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );
    this.saltRounds = Number(configService.get('BCRYPT_SALT_ROUNDS'));

    ConfigValidationUtility.validate(this);
  }
}
