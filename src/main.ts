import 'reflect-metadata';
import { Application } from './app/index.js';
import { createApplicationContainer, types } from './shared/container/index.js';
import { LoggerInterface } from './shared/libs/logger/logger.interface.js';
import { ConfigInterface } from './shared/config/config.interface.js';

async function bootstrap() {
  const container = createApplicationContainer();
  const logger = container.get<LoggerInterface>(types.LoggerInterface);
  const config = container.get<ConfigInterface>(types.ConfigInterface);
  const application = container.get<Application>(types.Application);

  logger.info('Application starting...');
  logger.info(`Application running on port ${config.get<number>('PORT')}`);

  application.init();

  logger.info('Application successfully started');
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
