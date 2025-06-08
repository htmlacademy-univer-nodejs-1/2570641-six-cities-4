/* eslint-disable node/callback-return */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../rest/middleware/middleware.interface.js';
import { DocumentExistenceInterface } from '../../types/document-existence.interface.js';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistenceInterface,
    private readonly entityName: string,
    private readonly paramName: string = 'id'
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];

    if (!documentId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: `Parameter ${this.paramName} is required`
      });
      return;
    }

    try {
      const exists = await this.service.exists(documentId);

      if (!exists) {
        res.status(StatusCodes.NOT_FOUND).json({
          error: `${this.entityName} with id ${documentId} not found`
        });
        return;
      }

      next();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }
}
