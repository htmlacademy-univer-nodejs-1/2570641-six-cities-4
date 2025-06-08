import { inject, injectable } from 'inversify';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteRepositoryInterface } from './favorite-repository.interface.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { types } from '../../container/types.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { OfferRepositoryInterface } from '../offer/offer-repository.interface.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

@injectable()
export class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(types.FavoriteRepositoryInterface) private readonly favoriteRepository: FavoriteRepositoryInterface,
    @inject(types.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface
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

  public async addToFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const existingFavorite = await this.favoriteRepository.findByUserIdAndOfferId(userId, offerId);

    if (!existingFavorite) {
      await this.favoriteRepository.create({
        userId: userId as unknown as Ref<UserEntity>,
        offerId: offerId as unknown as Ref<OfferEntity>
      });
    }

    const offer = await this.offerRepository.findById(offerId);
    if (offer) {
      offer.isFavorite = true;
    }
    return offer;
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.favoriteRepository.deleteByUserIdAndOfferId(userId, offerId);

    const offer = await this.offerRepository.findById(offerId);
    if (offer) {
      offer.isFavorite = false;
    }
    return offer;
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

  public async isFavorite(userId: string, offerId: string): Promise<boolean> {
    const existingFavorite = await this.favoriteRepository.findByUserIdAndOfferId(userId, offerId);
    return !!existingFavorite;
  }
}
