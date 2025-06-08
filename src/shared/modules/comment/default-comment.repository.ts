import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CommentRepositoryInterface } from './comment-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';

@injectable()
export class DefaultCommentRepository implements CommentRepositoryInterface {
  constructor(
    @inject(COMPONENT.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async findById(id: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(id).exec();
  }

  public async create(item: Omit<CommentEntity, '_id'>): Promise<DocumentType<CommentEntity>> {
    return this.commentModel.create(item);
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .populate('userId')
      .sort({ publishDate: -1 })
      .limit(50)
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
