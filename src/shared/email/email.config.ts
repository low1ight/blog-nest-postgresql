import { Injectable } from '@nestjs/common';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../core/config.validation.utility';

@Injectable()
export class EmailConfig {
  @IsBoolean({
    message:
      'Set Env variable IS_NODEMAILER_ENABLE, example: true,false,0,1,enabled,disabled',
  })
  isNodemailerEnable: boolean;

  @IsNotEmpty({
    message: 'Set Env variable NODEMAILER_USER, example: qwerty@gmail.com',
  })
  nodemailerUser: string;

  @IsNotEmpty({
    message:
      'Set Env variable NODEMAILER_PASSWORD, example: "nzcz jyno lacy gbmq"',
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
