import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorViewType } from '../core/exception/types/error.view.type';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsViewModel: ErrorViewType[] = [];

        errors.forEach((e) => {
          if (!e.constraints) return;

          const errViewModel: ErrorViewType = {
            message: Object.values(e.constraints)[0],
            field: e.property,
          };

          errorsViewModel.push(errViewModel);
        });

        throw new BadRequestException(errorsViewModel);
      },
    }),
  );
}
