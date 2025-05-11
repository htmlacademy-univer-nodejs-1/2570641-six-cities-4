import { Application } from './app/index.js';
import { logger } from './shared/libs/logger/index.js';
import { config } from './shared/config/config.js';

logger.info('Application starting...');
logger.info(`Application running on port ${config.PORT}`);

const app = new Application();
app.init();

logger.info('Application successfully started');
