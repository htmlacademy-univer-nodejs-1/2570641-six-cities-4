import { injectable, inject } from 'inversify';
import { Command } from './command.interface.js';
import { LoggerInterface } from '../../shared/libs/logger/logger.interface.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { OfferGenerator } from '../../shared/offer-generator/index.js';
import { types } from '../../shared/container/types.js';

@injectable()
export class GenerateCommand implements Command {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath] = parameters;
    const offerCount = Number.parseInt(count, 10);

    if (isNaN(offerCount)) {
      this.logger.error('Count parameter must be a number');
      return;
    }

    this.logger.info(`Trying to generate ${count} offers to ${filepath}`);

    try {
      const generator = new OfferGenerator(offerCount);
      const tsvFileWriter = new TSVFileWriter(filepath);

      for await (const offer of generator.generate()) {
        await tsvFileWriter.write(offer);
      }

      await tsvFileWriter.end();

      this.logger.info(`File ${filepath} was created!`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error generating data: ${error.message}`);
      }
    }
  }
}
