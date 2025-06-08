import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { OfferRepositoryInterface } from './offer-repository.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { types } from '../../container/types.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from './city.enum.js';
import { FavoriteServiceInterface } from '../favorite/favorite-service.interface.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(types.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface,
    @inject(types.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface
  ) {}

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerRepository.findById(offerId);
    if (offer && userId) {
      offer.isFavorite = await this.favoriteService.isFavorite(userId, offerId);
    }
    return offer;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = {
      ...dto,
      date: new Date(),
      rating: 1,
      commentCount: 0,
      isFavorite: false
    };

    return this.offerRepository.create(offer);
  }

  public async find(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerRepository.find(limit);

    if (userId) {
      for (const offer of offers) {
        offer.isFavorite = await this.favoriteService.isFavorite(userId, offer.id);
      }
    } else {
      for (const offer of offers) {
        offer.isFavorite = false;
      }
    }

    return offers;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.deleteById(offerId);
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.updateById(offerId, dto);
  }

  public async findPremiumByCity(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerRepository.findPremiumByCity(city);

    if (userId) {
      for (const offer of offers) {
        offer.isFavorite = await this.favoriteService.isFavorite(userId, offer.id);
      }
    } else {
      for (const offer of offers) {
        offer.isFavorite = false;
      }
    }

    return offers;
  }


  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.incCommentCount(offerId);
  }

  public async calculateRating(_offerId: string): Promise<number> {
    // TODO: Implement actual rating calculation based on comments
    return 0;
  }

  public async findByUserId(_userId: string): Promise<DocumentType<OfferEntity>[]> {
    // TODO: Implement finding offers by user ID
    return [];
  }

  public async exists(documentId: string): Promise<boolean> {
    const offer = await this.findById(documentId);
    return offer !== null;
  }

  public async checkOwnership(offerId: string, userId: string): Promise<boolean> {
    const offer = await this.findById(offerId);
    return offer?.userId?.toString() === userId;
  }
}
