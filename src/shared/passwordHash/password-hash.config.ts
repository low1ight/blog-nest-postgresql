import { Injectable } from '@nestjs/common';
import { Min } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../core/config.validation.utility';

@Injectable()
export class PasswordHashConfig {
  @Min(1, { message: 'Set Env variable BCRYPT_SALT_ROUNDS, example: 10' })
  saltRounds: number;

  constructor(configService: ConfigService) {
    this.saltRounds = Number(configService.get('BCRYPT_SALT_ROUNDS'));
    ConfigValidationUtility.validate(this);
  }
}
