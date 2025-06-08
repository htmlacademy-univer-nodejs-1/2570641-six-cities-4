import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { types } from '../../../container/types.js';
import { createErrorObject } from '../helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';
import { HttpError } from '../errors/http-error.js';

@injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register HttpExceptionFilter');
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.ServiceError, error.message, [error.detail]));
  }
}
