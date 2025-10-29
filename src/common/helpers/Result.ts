export class Result {
  static ok<T>(content: T): SuccessfulResult<T> {
    return { content: content, isSuccessful: true };
  }

  static fail<T>(err: T): FailResult<T> {
    return { error: err, isSuccessful: false };
  }
}

export type ResultType<Data, Err> = SuccessfulResult<Data> | FailResult<Err>;

export type SuccessfulResult<T> = {
  isSuccessful: true;
  content: T;
};
export type FailResult<T> = {
  isSuccessful: false;
  error: T;
};
