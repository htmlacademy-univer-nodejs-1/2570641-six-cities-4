import mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from './database.interface.js';
import { types } from '../../container/types.js';

@injectable()
export class MongoDatabase implements DatabaseInterface {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Trying to connect to MongoDB...');

    try {
      await mongoose.connect(uri);
      this.logger.info('Database connection established successfully');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Database connection error: ${error.message}`);
      } else {
        this.logger.error('Unknown database connection error');
      }

      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from database...');

    try {
      await mongoose.disconnect();
      this.logger.info('Database connection closed');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Database disconnection error: ${error.message}`);
      } else {
        this.logger.error('Unknown database disconnection error');
      }

      throw error;
    }
  }
}
