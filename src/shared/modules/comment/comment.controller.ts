import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { Ref } from '@typegoose/typegoose';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware, ValidateDtoMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { types } from '../../container/types.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { DocumentExistsMiddleware } from '../../libs/middleware/index.js';

type ParamsOfferId = {
  offerId: string;
}

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(types.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(types.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(types.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async index(req: Request<ParamsOfferId>, res: Response): Promise<void> {
    const { offerId } = req.params;

    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, plainToInstance(CommentRdo, comments, { excludeExtraneousValues: true }));
  }

  public async create(req: Request<ParamsOfferId, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const { id: userId } = req.tokenPayload!;

    const result = await this.commentService.create({
      ...req.body,
      offerId: offerId as unknown as Ref<OfferEntity>,
      userId: userId as unknown as Ref<UserEntity>
    });
    this.created(res, plainToInstance(CommentRdo, result, { excludeExtraneousValues: true }));
  }
}
