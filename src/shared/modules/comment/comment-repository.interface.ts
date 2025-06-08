import { DocumentType } from '@typegoose/typegoose';
import { BaseRepositoryInterface } from '../base/base-repository.interface.js';
import { CommentEntity } from './comment.entity.js';

export interface CommentRepositoryInterface extends BaseRepositoryInterface<CommentEntity> {
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}
