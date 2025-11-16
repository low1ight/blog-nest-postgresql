export enum ErrorType {
  InvalidInput = 'Invalid input data',
}

abstract class ResultError<T> {
  abstract message: T;
  abstract errorType: ErrorType;
}

export class ResultInputError extends ResultError<InputError> {
  message: InputError;
  errorType: ErrorType;
  constructor(message: string, field: string) {
    super();
    this.message = { message, field };
    this.errorType = ErrorType.InvalidInput;
  }
}

export type InputError = {
  message: string;
  field: string;
};
