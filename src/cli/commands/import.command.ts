import { Command } from './command.interface.js';
import chalk from 'chalk';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Offer, OfferCity, OfferConvenience, OfferType, UserType } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    if (!filename) {
      console.error(chalk.red('Path to file is required'));
      return;
    }

    try {
      const offers = await this.readOfferData(filename);
      console.log(chalk.green(`${offers.length} offers imported from ${filename}`));

      console.log(chalk.blue('Sample of imported offers:'));
      for (let i = 0; i < Math.min(5, offers.length); i++) {
        console.log(chalk.white(JSON.stringify(offers[i], null, 2)));
      }

    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }

  private async readOfferData(filename: string): Promise<Offer[]> {
    const readStream = createReadStream(filename, {
      encoding: 'utf-8',
      highWaterMark: 64 * 1024, // 64KB chunks
    });

    const rl = createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    const offers: Offer[] = [];
    let lineCount = 0;

    return new Promise<Offer[]>((resolve, reject) => {
      rl.on('line', (line: string) => {
        if (!line || line.trim().length === 0) {
          return;
        }

        lineCount++;
        const offer = this.parseOfferLine(line);
        offers.push(offer);

        if (lineCount % 1000 === 0) {
          console.log(chalk.blue(`Processed ${lineCount} lines...`));
        }
      });

      rl.on('error', (err) => {
        reject(err);
      });

      rl.on('close', () => {
        resolve(offers);
      });
    });
  }

  private parseOfferLine(line: string): Offer {
    const [
      title,
      description,
      publishDate,
      city,
      previewUrl,
      photosUrl,
      isPremium,
      isFavorite,
      rating,
      offerType,
      roomsCount,
      guestsCount,
      cost,
      conveiences,
      userName,
      userEmail,
      userAvatarUrl,
      userPassword,
      userUserType,
      commentsCount,
      coordinatesLat,
      coordinatesLon,
    ] = line.split(';');

    return {
      title,
      description,
      publishDate: new Date(publishDate),
      city: city as OfferCity,
      previewUrl,
      photosUrl: photosUrl.split(',,'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number.parseFloat(rating),
      offerType: offerType as OfferType,
      roomsCount: Number.parseInt(roomsCount, 10),
      guestsCount: Number.parseInt(guestsCount, 10),
      cost: Number.parseFloat(cost),
      conveiences: conveiences.split(',,').map((conveience) => conveience as OfferConvenience),
      author: {
        name: userName,
        email: userEmail,
        avatarUrl: userAvatarUrl,
        password: userPassword,
        userType: userUserType as UserType
      },
      commentsCount: Number.parseInt(commentsCount, 10),
      coordinates: {
        lat: Number.parseFloat(coordinatesLat),
        lon: Number.parseFloat(coordinatesLon),
      },
    };
  }
}
