import { Application } from './app/index.js';
import { logger } from './shared/libs/logger/index.js';

logger.info('Application starting...');

const app = new Application();
app.init();

logger.info('Application successfully started');
