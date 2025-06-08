import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user.exception.js';

export class UserPasswordIncorrectException extends BaseUserException {
  public readonly httpStatusCode = StatusCodes.UNAUTHORIZED;

  constructor() {
    super('Incorrect user name or password');
  }
}
