import { BadRequestException } from '@nestjs/common';
import {
  ResultErrorType,
  ResultErrUnion,
} from '../helpers/result/result-error';

export function throwExceptionFromCustomErr(resultErr: ResultErrUnion) {
  switch (resultErr.errorType) {
    case ResultErrorType.InvalidInput:
      throw new BadRequestException(resultErr.message);
  }
}
