import { injectable, unmanaged } from 'inversify';
import { createWriteStream } from 'node:fs';
import { WriteStream } from 'node:fs';
import { Offer } from '../../types/index.js';

@injectable()
export class TSVFileWriter {
  private stream: WriteStream;

  constructor(@unmanaged() public readonly filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: 64 * 1024, // 64KB chunks
    });
  }

  public async write(offer: Offer): Promise<void> {
    const offerLine = [
      offer.title,
      offer.description,
      offer.publishDate.toISOString(),
      offer.city,
      offer.previewUrl,
      offer.photosUrl.join(',,'),
      offer.isPremium.toString(),
      offer.isFavorite.toString(),
      offer.rating.toString(),
      offer.offerType,
      offer.roomsCount.toString(),
      offer.guestsCount.toString(),
      offer.cost.toString(),
      offer.conveiences.join(',,'),
      offer.author.name,
      offer.author.email,
      offer.author.avatarUrl,
      offer.author.password,
      offer.author.userType,
      offer.commentsCount.toString(),
      offer.coordinates.lat.toString(),
      offer.coordinates.lon.toString(),
    ].join(';');

    return new Promise((resolve, _) => {
      const canContinue = this.stream.write(`${offerLine}\n`);

      if (canContinue) {
        resolve();
      } else {
        this.stream.once('drain', resolve);
      }
    });
  }

  public async end(): Promise<void> {
    return new Promise((resolve) => {
      this.stream.end(resolve);
    });
  }
}
