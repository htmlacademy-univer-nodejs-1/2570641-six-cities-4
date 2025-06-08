import { inject, injectable } from 'inversify';
import { DocumentType, types as TypegooseTypes } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteRepositoryInterface } from './favorite-repository.interface.js';
import { types } from '../../container/types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';

@injectable()
export class DefaultFavoriteRepository implements FavoriteRepositoryInterface {
  constructor(
    @inject(types.FavoriteModel) private readonly favoriteModel: TypegooseTypes.ModelType<FavoriteEntity>,
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public async findById(id: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findById(id).exec();
  }

  public async create(item: Omit<FavoriteEntity, '_id'>): Promise<DocumentType<FavoriteEntity>> {
    this.logger.info('Creating a new favorite item');
    return this.favoriteModel.create(item);
  }

  public async findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    this.logger.info(`Finding favorites for user: ${userId}`);
    return this.favoriteModel
      .find({ userId })
      .populate('offerId')
      .exec();
  }

  public async findByUserIdAndOfferId(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    this.logger.info(`Finding favorite for user: ${userId} and offer: ${offerId}`);
    return this.favoriteModel
      .findOne({ userId, offerId })
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    this.logger.info(`Deleting favorites for offer: ${offerId}`);
    const result = await this.favoriteModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }

  public async deleteByUserIdAndOfferId(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    this.logger.info(`Deleting favorite for user: ${userId} and offer: ${offerId}`);
    return this.favoriteModel
      .findOneAndDelete({ userId, offerId })
      .exec();
  }
}
