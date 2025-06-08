import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';

export interface FavoriteServiceInterface {
  findByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  isFavorite(userId: string, offerId: string): Promise<boolean>;
}
