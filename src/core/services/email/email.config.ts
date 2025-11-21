import { Injectable } from '@nestjs/common';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../config/config.validation.utility';
import {
  configValidationCorrectValueExample,
  configValidationMessage,
} from '../../config/config.validation.message';

@Injectable()
export class EmailConfig {
  @IsBoolean({
    message: configValidationMessage(
      'IS_NODEMAILER_ENABLE',
      configValidationCorrectValueExample.boolean,
    ),
  })
  isNodemailerEnable: boolean;

  @IsNotEmpty({
    message: configValidationMessage('NODEMAILER_USER', 'qwerty@gmail.com'),
  })
  nodemailerUser: string;

  @IsNotEmpty({
    message: configValidationMessage(
      'NODEMAILER_PASSWORD',
      '"nzcz jyno lacy gbmq"',
    ),
  })
  nodemailerPassword: string;

  constructor(private configService: ConfigService) {
    this.isNodemailerEnable = ConfigValidationUtility.convertToBoolean(
      this.configService.get<string>('IS_NODEMAILER_ENABLE'),
    ) as boolean;

    this.nodemailerUser =
      this.configService.get<string>('NODEMAILER_USER') || '';

    this.nodemailerPassword =
      this.configService.get<string>('NODEMAILER_PASSWORD') || '';
    ConfigValidationUtility.validate(this);
  }
}
