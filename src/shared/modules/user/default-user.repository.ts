import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { UserEntity } from './user.entity.js';
import { UserRepositoryInterface } from './user-repository.interface.js';
import { DocumentType } from '@typegoose/typegoose';
import { types } from '../../container/types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';

@injectable()
export class DefaultUserRepository implements UserRepositoryInterface {
  constructor(
    @inject(types.UserModel) private readonly userModel: Model<UserEntity>,
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    this.logger.info(`Looking for user with ID: ${id}`);
    return this.userModel.findById(id).exec() as Promise<DocumentType<UserEntity> | null>;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    this.logger.info(`Looking for user with email: ${email}`);
    return this.userModel.findOne({ email }).exec() as Promise<DocumentType<UserEntity> | null>;
  }

  public async create(item: Omit<UserEntity, '_id'>): Promise<DocumentType<UserEntity>> {
    this.logger.info('Creating a new user', { email: item.email });
    return this.userModel.create(item) as unknown as DocumentType<UserEntity>;
  }

  public async updateAvatar(userId: string, avatarPath: string): Promise<DocumentType<UserEntity> | null> {
    this.logger.info(`Updating avatar for user ${userId} to ${avatarPath}`);
    return this.userModel
      .findByIdAndUpdate(userId, { avatarPath }, { new: true })
      .exec() as Promise<DocumentType<UserEntity> | null>;
  }
}
