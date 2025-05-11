import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import { ConfigInterface } from '../shared/config/config.interface.js';
import { DatabaseInterface } from '../shared/libs/database/database.interface.js';
import { types } from '../shared/container/types.js';

@injectable()
export class Application {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(types.ConfigInterface) private readonly config: ConfigInterface,
    @inject(types.DatabaseInterface) private readonly databaseClient: DatabaseInterface
  ) {}

  public async init(): Promise<void> {
    this.logger.info('Application initialization...');

    const mongoUri = this.config.getMongoURI();

    try {
      await this.databaseClient.connect(mongoUri);
      this.logger.info('Application initialized');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Application initialization failed: ${error.message}`);
      }
      throw error;
    }
  }
}
