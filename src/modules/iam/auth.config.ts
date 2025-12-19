import { Injectable } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import {
  configValidationCorrectValueExample,
  configValidationMessage,
} from '../../core/config/config.validation.message';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../core/config/config.validation.utility';

@Injectable()
export class AuthConfig {
  @IsBoolean({
    message: configValidationMessage(
      'IS_USER_AUTO_CONFIRMED',
      configValidationCorrectValueExample.boolean,
    ),
  })
  isUserAutoConfirmed: boolean;

  constructor(private configService: ConfigService) {
    this.isUserAutoConfirmed = ConfigValidationUtility.convertToBoolean(
      this.configService.get('IS_USER_AUTO_CONFIRMED'),
    ) as boolean;

    ConfigValidationUtility.validate(this);
  }
}
