export enum ResultErrorType {
  InvalidInput = 'Invalid input data',
}

export abstract class ResultError<T, ErrT extends ResultErrorType> {
  abstract message: T;
  abstract errorType: ErrT;
}

export type ResultErrUnion = ResultInputError;

export class ResultInputError extends ResultError<
  InputError,
  ResultErrorType.InvalidInput
> {
  message: InputError;
  errorType: ResultErrorType;
  constructor(message: string, field: string) {
    super();
    this.message = { message, field };
    this.errorType = ResultErrorType.InvalidInput;
  }
}

export type InputError = {
  message: string;
  field: string;
};
