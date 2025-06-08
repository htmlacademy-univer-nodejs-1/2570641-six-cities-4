import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from '../../libs/rest/exception-filter/exception-filter.interface.js';
import { types } from '../../container/types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { BaseUserException } from './errors/index.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
