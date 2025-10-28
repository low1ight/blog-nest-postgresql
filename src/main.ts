import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception/exception-filter/http-exception.filter';
import { ErrorViewType } from './common/exception/types/error.view.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
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
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
