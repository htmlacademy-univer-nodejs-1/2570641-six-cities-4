import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import { types } from '../shared/container/types.js';

@injectable()
export class Application {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public init(): void {
    this.logger.info('Application initialized');
  }
}
