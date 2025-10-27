import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception/exception-filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsViewModel: { message: string; field: string }[] = [];

        errors.forEach((e) => {
          if (!e.constraints) return;

          const errViewModel = {
            message: Object.values(e.constraints)[0],
            field: e.property,
          };

          errorsViewModel.push(errViewModel);
        });

        throw new HttpException(errorsViewModel, 400);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
