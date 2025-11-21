import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ResultErrorType,
  ResultErrUnion,
} from '../helpers/result/result-error';

export function throwExceptionFromCustomErr(resultErr: ResultErrUnion) {
  switch (resultErr.errorType) {
    case ResultErrorType.InvalidInput:
      throw new HttpException(resultErr.message, HttpStatus.BAD_REQUEST);
    default:
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
}
