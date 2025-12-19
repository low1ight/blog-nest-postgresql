export enum ResultErrorType {
  InvalidInput = 'Invalid input data',
  NotFound = 'Not found',
  AccessDenied = 'AccessDenied',
}

export abstract class ResultError<T, ErrT extends ResultErrorType> {
  abstract message: T;
  abstract errorType: ErrT;
}

export type ResultErrUnion =
  | ResultInputError
  | ResultNotFoundError
  | AccessDeniedError;

//optional field for the opportunity create an empty Error message arr, and then push several Error
export class ResultInputError extends ResultError<
  InputError[],
  ResultErrorType.InvalidInput
> {
  message: InputError[];
  errorType: ResultErrorType.InvalidInput;
  constructor(message?: string, field?: string) {
    super();
    this.message = message && field ? [{ message, field }] : [];
    this.errorType = ResultErrorType.InvalidInput;
  }

  addErr(message: string, field: string) {
    this.message.push({ message, field });
  }

  isExistErr() {
    return this.message.length > 0;
  }
}

export class ResultNotFoundError extends ResultError<
  string,
  ResultErrorType.NotFound
> {
  message: string;
  errorType: ResultErrorType.NotFound;

  constructor() {
    super();
    this.message = 'Not Found';
    this.errorType = ResultErrorType.NotFound;
  }
}

export class AccessDeniedError extends ResultError<
  string,
  ResultErrorType.AccessDenied
> {
  message: string;
  errorType: ResultErrorType.AccessDenied;

  constructor(message: string) {
    super();
    this.message = message;
    this.errorType = ResultErrorType.AccessDenied;
  }
}

export type InputError = {
  message: string;
  field: string;
};
