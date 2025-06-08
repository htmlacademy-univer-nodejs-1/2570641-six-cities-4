import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { MiddlewareInterface } from './middleware.interface.js';
import { HttpError } from '../errors/http-error.js';

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) {}

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const objectId = req.params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${this.param} field must be a valid id`,
      'ValidateObjectIdMiddleware'
    );
  }
}
