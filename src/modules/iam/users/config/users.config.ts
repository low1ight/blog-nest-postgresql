import { Injectable } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../../../core/config.validation.utility';
import {
  configValidationCorrectValueExample,
  configValidationMessage,
} from '../../../../core/config.validation.message';

@Injectable()
export class UsersConfig {
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
