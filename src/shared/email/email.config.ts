import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from '../../core/config.validation.utility';

@Injectable()
export class EmailConfig {
  @IsNotEmpty({
    message: 'Set Env variable NODEMAILER_USER, example: qwerty@gmail.com',
  })
  nodemailerUser: string;

  @IsNotEmpty({
    message:
      'Set Env variable NODEMAILER_PASSWORD, example: "nzcz jyno lacy gbmq"',
  })
  nodemailerPassword: string;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerUser = configService.get<string>('NODEMAILER_USER') || '';
    this.nodemailerPassword =
      configService.get<string>('NODEMAILER_PASSWORD') || '';
    ConfigValidationUtility.validate(this);
  }
}
