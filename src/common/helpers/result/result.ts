//global use result type
export type ResultType<Data, Err> = SuccessfulResult<Data> | FailResult<Err>;

//types for result
type SuccessfulResult<T> = {
  isSuccessful: true;
  content: T;
};
type FailResult<T> = {
  isSuccessful: false;
  error: T;
};

//result
export class Result {
  static ok(): SuccessfulResult<null>;
  static ok<T>(content: T): SuccessfulResult<T>;
  static ok<T>(content?: T): SuccessfulResult<T | null> {
    return { content: content ?? null, isSuccessful: true };
  }

  static fail<T>(err: T): FailResult<T> {
    return { error: err, isSuccessful: false };
  }
}
