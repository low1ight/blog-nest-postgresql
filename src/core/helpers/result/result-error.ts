export enum ResultErrorType {
  InvalidInput = 'Invalid input data',
}

export abstract class ResultError<T, ErrT extends ResultErrorType> {
  abstract message: T;
  abstract errorType: ErrT;
}

export type ResultErrUnion = ResultInputError;

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

export type InputError = {
  message: string;
  field: string;
};
