import { DocumentType } from '@typegoose/typegoose';
import { BaseRepositoryInterface } from '../base/base-repository.interface.js';
import { UserEntity } from './user.entity.js';

export interface UserRepositoryInterface extends BaseRepositoryInterface<UserEntity> {
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
}
