import 'reflect-metadata';
import { webcrypto } from 'node:crypto';

if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = webcrypto;
}

import { Application } from './app/index.js';
import { container, types } from './shared/container/index.js';
import { LoggerInterface } from './shared/libs/logger/logger.interface.js';
import { ConfigInterface } from './shared/config/config.interface.js';
import { DatabaseInterface } from './shared/libs/database/index.js';

async function bootstrap() {
  const logger = container.get<LoggerInterface>(types.LoggerInterface);
  const config = container.get<ConfigInterface>(types.ConfigInterface);
  const databaseClient = container.get<DatabaseInterface>(types.DatabaseInterface);
  const application = container.get<Application>(types.Application);

  try {
    logger.info('Application starting...');
    logger.info(`Application running on port ${config.get<number>('PORT')}`);

    await application.init();

    logger.info('Application successfully started');

    process.on('SIGINT', async () => {
      logger.info('Application termination signal received...');
      await databaseClient.disconnect();
      logger.info('Application terminated');
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Application bootstrap failed: ${error.message}`);
    }
    throw error;
  }
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
