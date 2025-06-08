import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError as ClassValidatorError } from 'class-validator';
import { MiddlewareInterface } from './middleware.interface.js';
import { ValidationError } from '../errors/validation-error.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const dtoInstance = plainToInstance(this.dto, req.body);

    validate(dtoInstance)
      .then((errors) => {
        if (errors.length > 0) {
          const validationErrorFields = errors.map((error: ClassValidatorError) => ({
            property: error.property,
            value: error.value,
            messages: error.constraints ? Object.values(error.constraints) : []
          }));

          throw new ValidationError('Validation error', validationErrorFields);
        }
        next();
      })
      .catch(next);
  }
}
