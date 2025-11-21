import { Injectable } from '@nestjs/common';
import { Min } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../config/config.validation.utility';
import { configValidationMessage } from '../../config/config.validation.message';

@Injectable()
export class PasswordHashConfig {
  @Min(1, { message: configValidationMessage('BCRYPT_SALT_ROUNDS', '10') })
  saltRounds: number;

  constructor(configService: ConfigService) {
    this.saltRounds = Number(configService.get('BCRYPT_SALT_ROUNDS'));
    ConfigValidationUtility.validate(this);
  }
}
