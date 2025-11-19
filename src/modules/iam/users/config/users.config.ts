import { Injectable } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../../../core/config.validation.utility';

@Injectable()
export class UsersConfig {
  @IsBoolean({
    message: 'Set Env variable IS_USER_AUTO_CONFIRMED, example: true,false,0,1',
  })
  isUserAutoConfirmed: boolean;

  constructor(private configService: ConfigService) {
    this.isUserAutoConfirmed = ConfigValidationUtility.convertToBoolean(
      this.configService.get('IS_USER_AUTO_CONFIRMED'),
    ) as boolean;

    ConfigValidationUtility.validate(this);
  }
}
