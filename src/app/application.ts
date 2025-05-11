import { logger } from '../shared/libs/logger/index.js';

export class Application {
  public init(): void {
    logger.info('Application initialized');
  }
}
