import { DocumentType } from '@typegoose/typegoose';
import { BaseEntity } from './base-entity.js';

export interface BaseRepositoryInterface<T extends BaseEntity> {
  findById(id: string): Promise<DocumentType<T> | null>;
  create(item: Omit<T, '_id'>): Promise<DocumentType<T>>;
}
