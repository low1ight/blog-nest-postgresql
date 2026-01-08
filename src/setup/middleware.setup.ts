import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export function middlewareSetup(app: INestApplication) {
  app.use(cookieParser());
}
