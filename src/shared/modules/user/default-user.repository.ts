import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { UserEntity } from './user.entity.js';
import { UserRepositoryInterface } from './user-repository.interface.js';
import { DocumentType } from '@typegoose/typegoose';
import { COMPONENT } from '../../types/component.types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';

@injectable()
export class DefaultUserRepository implements UserRepositoryInterface {
  constructor(
    @inject(COMPONENT.UserModel) private readonly userModel: Model<UserEntity>,
    @inject(COMPONENT.LoggerInterface) private readonly logger: LoggerInterface
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
}
