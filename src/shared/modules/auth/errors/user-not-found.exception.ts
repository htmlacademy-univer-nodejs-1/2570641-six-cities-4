import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user.exception.js';

export class UserNotFoundException extends BaseUserException {
  public readonly httpStatusCode = StatusCodes.NOT_FOUND;

  constructor() {
    super('User not found');
  }
}
