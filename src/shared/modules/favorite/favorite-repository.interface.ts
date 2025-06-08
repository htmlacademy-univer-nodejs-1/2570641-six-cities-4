import { DocumentType } from '@typegoose/typegoose';
import { BaseRepositoryInterface } from '../base/base-repository.interface.js';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteRepositoryInterface extends BaseRepositoryInterface<FavoriteEntity> {
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  findByUserIdAndOfferId(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null>;
  deleteByOfferId(offerId: string): Promise<number>;
  deleteByUserIdAndOfferId(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null>;
}
