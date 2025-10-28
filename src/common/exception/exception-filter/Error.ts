export enum ErrorType {
  InvalidInput = 'Invalid input data',
}

export class ResultError {
  static inputError(message: string, field: string): InputError {
    return { message, field };
  }
}

export type InputError = {
  message: string;
  field: string;
};
