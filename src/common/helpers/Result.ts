export class Result {
  static ok<T>(content: T): SuccessfulResult<T> {
    return { content: content, isSuccessful: true };
  }

  static fail<T>(err: T, errorType: string): FailResult<T> {
    return { error: err, isSuccessful: false, errorType };
  }
}

export type ResultType<Data, Err> = SuccessfulResult<Data> | FailResult<Err>;

export type SuccessfulResult<T> = {
  isSuccessful: true;
  content: T;
};
export type FailResult<T> = {
  isSuccessful: false;
  errorType: string;
  error: T;
};
