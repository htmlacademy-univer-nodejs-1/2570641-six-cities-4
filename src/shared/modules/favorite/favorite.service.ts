import { inject, injectable } from 'inversify';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteRepositoryInterface } from './favorite-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { OfferRepositoryInterface } from '../offer/offer-repository.interface.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

@injectable()
export class FavoriteService {
  constructor(
    @inject(COMPONENT.FavoriteRepositoryInterface) private readonly favoriteRepository: FavoriteRepositoryInterface,
    @inject(COMPONENT.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface
  ) { }

  public async create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    const existingFavorite = await this.favoriteRepository.findByUserIdAndOfferId(
      dto.userId.toString(),
      dto.offerId.toString()
    );

    if (existingFavorite) {
      return existingFavorite;
    }

    return this.favoriteRepository.create(dto);
  }

  public async delete(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteRepository.deleteByUserIdAndOfferId(userId, offerId);
  }

  public async findByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId);
    const offerIds = favorites.map((favorite) => favorite.offerId.toString());

    const offers: DocumentType<OfferEntity>[] = [];

    for (const offerId of offerIds) {
      const offer = await this.offerRepository.findById(offerId);
      if (offer) {
        offer.isFavorite = true;
        offers.push(offer);
      }
    }

    return offers;
  }

  public async toggleFavorite(userId: string, offerId: string): Promise<boolean> {
    const existingFavorite = await this.favoriteRepository.findByUserIdAndOfferId(userId, offerId);

    if (existingFavorite) {
      await this.favoriteRepository.deleteByUserIdAndOfferId(userId, offerId);
      return false;
    } else {
      await this.favoriteRepository.create({
        userId: userId as unknown as Ref<UserEntity>,
        offerId: offerId as unknown as Ref<OfferEntity>
      });
      return true;
    }
  }
}
