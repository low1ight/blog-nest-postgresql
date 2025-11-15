import { IsNotEmpty, Min } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidationUtility } from './config.validation.utility';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreConfig {
  @Min(1, { message: 'Set Env variable PORT, example: 3000' })
  port: number;

  @Min(1, { message: 'Set Env variable PG_PORT, example: 5432' })
  pgPort: number;

  @IsNotEmpty({ message: 'Set Env variable PG_USER_NAME, example: "Admin"' })
  pgUserName: string;

  @IsNotEmpty({ message: 'Set Env variable PG_PASSWORD, example: "qwerty"' })
  pgPassword: string;

  @IsNotEmpty({ message: 'Set Env variable PG_HOST, example: "localhost"' })
  pgHost: string;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get('PORT'));
    this.pgPort = Number(this.configService.get('PG_PORT'));
    this.pgUserName = this.configService.get('PG_USER_NAME') || '';
    this.pgPassword = this.configService.get('PG_PASSWORD') || '';
    this.pgHost = this.configService.get('PG_HOST') || '';

    ConfigValidationUtility.validate(this);
  }
}
