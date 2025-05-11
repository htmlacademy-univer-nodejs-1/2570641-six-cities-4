import { pino } from 'pino';

export const logger = pino({
  level: 'info'
});

/**
 * Example usage:
 *
 * import { logger } from './shared/libs/logger/index.js';
 *
 * logger.info('Application started');
 * logger.error({ err }, 'An error occurred');
 * logger.debug('Debug information');
 * logger.warn('Warning message');
 */
