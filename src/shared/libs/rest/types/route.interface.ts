import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { MiddlewareInterface } from '../middleware/middleware.interface.js';

export interface Route {
  path: string;
  method: HttpMethod;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: Request<any, any, any>, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
