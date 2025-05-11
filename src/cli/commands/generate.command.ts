import { Command } from './command.interface.js';
import { MockOfferGenerator } from '../../shared/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import chalk from 'chalk';

export class GenerateCommand implements Command {
  private readonly DEFAULT_COUNT = 10;

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offersCount = count ? parseInt(count, 10) : this.DEFAULT_COUNT;

    if (isNaN(offersCount)) {
      console.error(chalk.red(`Count must be a number, received: ${count}`));
      return;
    }

    if (!filepath) {
      console.error(chalk.red('Path to file is required'));
      return;
    }

    if (!url) {
      console.error(chalk.red('URL to fetch mock data is required'));
      return;
    }

    try {
      const offerGenerator = new MockOfferGenerator(url);
      console.log(chalk.blue(`Fetching data from ${url}...`));
      await offerGenerator.loadMockData();
      console.log(chalk.blue(`Generating ${offersCount} offers...`));
      const offers = offerGenerator.generate(offersCount);

      const fileWriter = new TSVFileWriter(filepath);
      console.log(chalk.blue(`Writing data to ${filepath}...`));

      for (const offer of offers) {
        await fileWriter.write(offer);
      }

      await fileWriter.end();

      console.log(chalk.green(`${offersCount} offers generated to ${filepath}`));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error generating data: ${error.message}`));
      } else {
        console.error(chalk.red('Unknown error occurred during generate operation'));
      }
    }
  }
}
