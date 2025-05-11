import { injectable, inject } from 'inversify';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { LoggerInterface } from '../../shared/libs/logger/logger.interface.js';
import { types } from '../../shared/container/types.js';

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    this.logger.info(`Import file: ${filename}`);

    const fileReader = new TSVFileReader(filename);

    try {
      fileReader.read();
      this.logger.info(`File ${filename} was successfully imported.`);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Can't read the file: ${err.message}`);
      }
    }
  }
}
