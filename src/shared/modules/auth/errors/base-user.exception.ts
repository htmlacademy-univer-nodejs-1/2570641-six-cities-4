export abstract class BaseUserException extends Error {
  public abstract readonly httpStatusCode: number;

  constructor(message: string) {
    super(message);
  }
}
