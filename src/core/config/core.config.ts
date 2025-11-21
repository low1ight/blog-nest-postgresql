import { IsBoolean, IsNotEmpty, Min } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from './config.validation.utility';
import { Injectable } from '@nestjs/common';
import {
  configValidationCorrectValueExample,
  configValidationMessage,
} from './config.validation.message';

@Injectable()
export class CoreConfig {
  @Min(1, { message: configValidationMessage('PORT', '3000') })
  port: number;

  @Min(1, { message: configValidationMessage('PG_PORT', '5432') })
  pgPort: number;

  @IsNotEmpty({
    message: configValidationMessage('PG_USER_NAME', 'Admin'),
  })
  pgUserName: string;

  @IsNotEmpty({
    message: configValidationMessage('PG_PASSWORD', 'qwerty'),
  })
  pgPassword: string;

  @IsNotEmpty({
    message: configValidationMessage('PG_HOST', 'localhost'),
  })
  pgHost: string;

  @IsBoolean({
    message: configValidationMessage(
      'INCLUDE_TESTING_MODULE',
      configValidationCorrectValueExample.boolean,
    ),
  })
  includeTestModule: boolean;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get('PORT'));

    this.includeTestModule = ConfigValidationUtility.convertToBoolean(
      this.configService.get('INCLUDE_TESTING_MODULE'),
    ) as boolean;

    this.pgPort = Number(this.configService.get('PG_PORT'));
    this.pgUserName = this.configService.get('PG_USER_NAME') || '';
    this.pgPassword = this.configService.get('PG_PASSWORD') || '';
    this.pgHost = this.configService.get('PG_HOST') || '';

    ConfigValidationUtility.validate(this);
  }
}
