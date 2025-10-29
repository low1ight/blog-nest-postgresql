export enum ErrorType {
  InvalidInput = 'Invalid input data',
}

// export class ResultError<T> {
//   constructor(
//     private readonly message: T,
//     private readonly errorType: ErrorType,
//   ) {}
//
//   static invalidInput(message: string, field: string) {
//     return new ResultError<InputError>(
//       { message, field },
//       ErrorType.InvalidInput,
//     );
//   }
// }

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
