import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { OfferRepositoryInterface } from './offer-repository.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { types } from '../../container/types.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from './city.enum.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(types.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface
  ) {}

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.findById(offerId);
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = {
      ...dto,
      date: new Date(),
      rating: 0,
      commentCount: 0,
      isFavorite: false
    };

    return this.offerRepository.create(offer);
  }

  public async find(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerRepository.find(limit);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.deleteById(offerId);
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.updateById(offerId, dto);
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerRepository.findPremiumByCity(city);
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
}
