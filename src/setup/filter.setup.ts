import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '../core/exception/exception-filter/http-exception.filter';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}
