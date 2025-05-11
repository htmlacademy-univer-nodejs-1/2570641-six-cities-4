import { injectable } from 'inversify';
import { pino } from 'pino';
import { LoggerInterface } from './logger.interface.js';

@injectable()
export class PinoLogger implements LoggerInterface {
  private readonly logger;

  constructor() {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: true
        }
      },
      level: 'info'
    });
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(Object.fromEntries(args.map((arg, index) => [`arg${index}`, arg])), message);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(Object.fromEntries(args.map((arg, index) => [`arg${index}`, arg])), message);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(Object.fromEntries(args.map((arg, index) => [`arg${index}`, arg])), message);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(Object.fromEntries(args.map((arg, index) => [`arg${index}`, arg])), message);
  }
}
