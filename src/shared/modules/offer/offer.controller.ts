import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Ref } from '@typegoose/typegoose';
import { BaseController, HttpMethod, HttpError, ValidateObjectIdMiddleware, ValidateDtoMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { types } from '../../container/types.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { plainToInstance } from 'class-transformer';
import { City } from './city.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { DocumentExistsMiddleware } from '../../libs/middleware/index.js';

type ParamsOfferId = {
  offerId: string;
}

type ParamsCity = {
  city: string;
}

type QueryLimit = {
  limit?: number;
}

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(types.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(types.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.showPremium });
  }

  public async index(req: Request<unknown, unknown, unknown, QueryLimit>, res: Response): Promise<void> {
    const limit = req.query.limit || 60;
    const userId = req.tokenPayload?.id;
    const offers = await this.offerService.find(Number(limit), userId);
    this.ok(res, plainToInstance(OfferPreviewRdo, offers, { excludeExtraneousValues: true }));
  }

  public async create(req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const { id: userId } = req.tokenPayload!;
    const result = await this.offerService.create({ ...req.body, userId: userId as unknown as Ref<UserEntity> });
    this.created(res, plainToInstance(OfferRdo, result, { excludeExtraneousValues: true }));
  }

  public async show(req: Request<ParamsOfferId>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = req.tokenPayload?.id;
    const offer = await this.offerService.findById(offerId, userId);

    this.ok(res, plainToInstance(OfferRdo, offer, { excludeExtraneousValues: true }));
  }

  public async update(req: Request<ParamsOfferId, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const { id: userId } = req.tokenPayload!;

    const isOwner = await this.offerService.checkOwnership(offerId, userId);
    if (!isOwner) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied. You can only edit your own offers.',
        'OfferController'
      );
    }

    const updatedOffer = await this.offerService.updateById(offerId, req.body);
    this.ok(res, plainToInstance(OfferRdo, updatedOffer, { excludeExtraneousValues: true }));
  }

  public async delete(req: Request<ParamsOfferId>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const { id: userId } = req.tokenPayload!;

    const isOwner = await this.offerService.checkOwnership(offerId, userId);
    if (!isOwner) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied. You can only delete your own offers.',
        'OfferController'
      );
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async showPremium(req: Request<ParamsCity>, res: Response): Promise<void> {
    const { city } = req.params;

    if (!Object.values(City).includes(city as City)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Invalid city: ${city}`,
        'OfferController'
      );
    }

    const userId = req.tokenPayload?.id;
    const offers = await this.offerService.findPremiumByCity(city as City, userId);
    this.ok(res, plainToInstance(OfferPreviewRdo, offers, { excludeExtraneousValues: true }));
  }
}
