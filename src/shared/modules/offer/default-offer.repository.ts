import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { OfferEntity } from './offer.entity.js';
import { OfferRepositoryInterface } from './offer-repository.interface.js';
import { DocumentType } from '@typegoose/typegoose';
import { types } from '../../container/types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { City } from './city.enum.js';

@injectable()
export class DefaultOfferRepository implements OfferRepositoryInterface {
  constructor(
    @inject(types.OfferModel) private readonly offerModel: Model<OfferEntity>,
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    this.logger.info(`Looking for offer with ID: ${id}`);
    return this.offerModel.findById(id).exec() as Promise<DocumentType<OfferEntity> | null>;
  }

  public async create(item: Omit<OfferEntity, '_id'>): Promise<DocumentType<OfferEntity>> {
    this.logger.info('Creating a new offer', { title: item.title });
    return this.offerModel.create(item) as unknown as DocumentType<OfferEntity>;
  }

  public async find(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    const limitValue = limit || 60;
    this.logger.info(`Finding ${limitValue} offers`);
    return this.offerModel
      .find()
      .sort({ date: -1 })
      .limit(limitValue)
      .populate('userId')
      .exec() as unknown as Promise<DocumentType<OfferEntity>[]>;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    this.logger.info(`Deleting offer with ID: ${offerId}`);
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec() as unknown as Promise<DocumentType<OfferEntity> | null>;
  }

  public async updateById(offerId: string, offer: Partial<OfferEntity>): Promise<DocumentType<OfferEntity> | null> {
    this.logger.info(`Updating offer with ID: ${offerId}`);
    return this.offerModel
      .findByIdAndUpdate(offerId, offer, { new: true })
      .populate('userId')
      .exec() as unknown as Promise<DocumentType<OfferEntity> | null>;
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    this.logger.info(`Finding premium offers for city: ${city}`);
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ date: -1 })
      .limit(3)
      .populate('userId')
      .exec() as unknown as Promise<DocumentType<OfferEntity>[]>;
  }


  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    this.logger.info(`Incrementing comment count for offer: ${offerId}`);
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } }, { new: true })
      .exec() as unknown as Promise<DocumentType<OfferEntity> | null>;
  }

  public async updateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {
    this.logger.info(`Updating rating for offer: ${offerId} to ${newRating}`);
    return this.offerModel
      .findByIdAndUpdate(offerId, { rating: newRating }, { new: true })
      .exec() as unknown as Promise<DocumentType<OfferEntity> | null>;
  }
}
