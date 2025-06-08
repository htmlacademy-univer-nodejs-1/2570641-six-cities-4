import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CommentRepositoryInterface } from './comment-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferRepositoryInterface } from '../offer/offer-repository.interface.js';

@injectable()
export class CommentService {
  constructor(
    @inject(COMPONENT.CommentRepositoryInterface) private readonly commentRepository: CommentRepositoryInterface,
    @inject(COMPONENT.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentRepository.create({
      ...dto,
      publishDate: new Date()
    });

    await this.updateOfferRating(dto.offerId.toString());
    await this.incrementCommentCount(dto.offerId.toString());

    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentRepository.findByOfferId(offerId);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    return this.commentRepository.deleteByOfferId(offerId);
  }

  private async updateOfferRating(offerId: string): Promise<void> {
    const comments = await this.findByOfferId(offerId);

    if (!comments.length) {
      return;
    }

    const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const averageRating = totalRating / comments.length;

    const offer = await this.offerRepository.findById(offerId);

    if (offer) {
      offer.rating = averageRating;
      await offer.save();
    }
  }

  private async incrementCommentCount(offerId: string): Promise<void> {
    const offer = await this.offerRepository.findById(offerId);

    if (offer) {
      offer.commentCount++;
      await offer.save();
    }
  }
}
