import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { middlewareSetup } from './middleware.setup';
import { filterSetup } from './filter.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  middlewareSetup(app);
  filterSetup(app);
}
