import { inject, injectable } from 'inversify';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { OfferRepositoryInterface } from './offer-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentRepositoryInterface } from '../comment/comment-repository.interface.js';
import { FavoriteRepositoryInterface } from '../favorite/favorite-repository.interface.js';
import { UserEntity } from '../user/user.entity.js';
import { City } from './city.enum.js';

@injectable()
export class OfferService {
  constructor(
    @inject(COMPONENT.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface,
    @inject(COMPONENT.CommentRepositoryInterface) private readonly commentRepository: CommentRepositoryInterface,
    @inject(COMPONENT.FavoriteRepositoryInterface) private readonly favoriteRepository: FavoriteRepositoryInterface
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

  public async findAll(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerRepository.find(limit);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.commentRepository.deleteByOfferId(offerId);
    return this.offerRepository.deleteById(offerId);
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.updateById(offerId, dto);
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerRepository.findPremiumByCity(city);
  }

  public async findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    // Получаем все избранные записи для пользователя
    const favorites = await this.favoriteRepository.findByUserId(userId);

    // Извлекаем идентификаторы предложений
    const offerIds = favorites.map((favorite) => favorite.offerId.toString());

    // Получаем предложения по их идентификаторам и помечаем их как избранные
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

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.incCommentCount(offerId);
  }

  public async updateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.updateRating(offerId, newRating);
  }

  public async toggleFavorite(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerRepository.findById(offerId);

    if (!offer) {
      return null;
    }
    const existingFavorite = await this.favoriteRepository.findByUserIdAndOfferId(userId, offerId);

    if (existingFavorite) {
      await this.favoriteRepository.deleteByUserIdAndOfferId(userId, offerId);
      offer.isFavorite = false;
    } else {
      await this.favoriteRepository.create({
        userId: userId as unknown as Ref<UserEntity>,
        offerId: offerId as unknown as Ref<OfferEntity>
      });
      offer.isFavorite = true;
    }

    return this.offerRepository.updateById(offerId, { isFavorite: offer.isFavorite });
  }
}
