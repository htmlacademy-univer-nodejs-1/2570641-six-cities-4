import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer, OfferCity, OfferConvenience, OfferType, UserType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split(';'))
      .map(
        (
          [
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
          ]
        ) => (
          {
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
          })
      );
  }
}
