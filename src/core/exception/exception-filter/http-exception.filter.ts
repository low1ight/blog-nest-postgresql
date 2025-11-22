import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InputError } from '../../helpers/result/result-error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exc = exception.getResponse();

    if (status === 400) {
      const err = exc['message'] as InputError[];
      response.status(status).json({
        errorsMessages: err ?? exc,
      });
    }
    if (status === 401) {
      const err = exc['message'] as string;
      response.status(status).json({
        errorsMessages: err,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
