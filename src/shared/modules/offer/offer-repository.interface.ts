import { DocumentType } from '@typegoose/typegoose';
import { BaseRepositoryInterface } from '../base/base-repository.interface.js';
import { OfferEntity } from './offer.entity.js';
import { City } from './city.enum.js';

export interface OfferRepositoryInterface extends BaseRepositoryInterface<OfferEntity> {
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, offer: Partial<OfferEntity>): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null>;
}
