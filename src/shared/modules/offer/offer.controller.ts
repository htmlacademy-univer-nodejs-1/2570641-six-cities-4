import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod, HttpError, ValidateObjectIdMiddleware, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { types } from '../../container/types.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { plainToInstance } from 'class-transformer';
import { City } from './city.enum.js';
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
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
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
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.showPremium });
  }

  public async index(req: Request<unknown, unknown, unknown, QueryLimit>, res: Response): Promise<void> {
    const limit = req.query.limit || 60;
    const offers = await this.offerService.find(Number(limit));
    this.ok(res, plainToInstance(OfferPreviewRdo, offers, { excludeExtraneousValues: true }));
  }

  public async create(req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create(req.body);
    this.created(res, plainToInstance(OfferRdo, result, { excludeExtraneousValues: true }));
  }

  public async show(req: Request<ParamsOfferId>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, plainToInstance(OfferRdo, offer, { excludeExtraneousValues: true }));
  }

  public async update(req: Request<ParamsOfferId, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = req.params;
    const updatedOffer = await this.offerService.updateById(offerId, req.body);

    this.ok(res, plainToInstance(OfferRdo, updatedOffer, { excludeExtraneousValues: true }));
  }

  public async delete(req: Request<ParamsOfferId>, res: Response): Promise<void> {
    const { offerId } = req.params;
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

    const offers = await this.offerService.findPremiumByCity(city as City);
    this.ok(res, plainToInstance(OfferPreviewRdo, offers, { excludeExtraneousValues: true }));
  }
}
