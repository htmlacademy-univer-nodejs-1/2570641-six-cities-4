import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod, HttpError } from '../../libs/rest/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { types } from '../../container/types.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { OfferPreviewRdo } from '../offer/rdo/offer-preview.rdo.js';
import { OfferRdo } from '../offer/rdo/offer.rdo.js';
import { plainToInstance } from 'class-transformer';

type ParamsOfferId = {
  offerId: string;
}

type ParamsStatus = {
  status: string;
}

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(types.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(types.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId/:status', method: HttpMethod.Post, handler: this.toggleFavorite });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    // TODO: Extract userId from JWT token
    const userId = 'mock_user_id';
    const favoriteOffers = await this.favoriteService.findByUserId(userId);
    this.ok(res, plainToInstance(OfferPreviewRdo, favoriteOffers, { excludeExtraneousValues: true }));
  }

  public async toggleFavorite(req: Request<ParamsOfferId & ParamsStatus>, res: Response): Promise<void> {
    const { offerId, status } = req.params;
    
    if (status !== '0' && status !== '1') {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Status must be 0 or 1',
        'FavoriteController'
      );
    }

    // TODO: Extract userId from JWT token
    const userId = 'mock_user_id';
    const isFavorite = status === '1';

    let result;
    if (isFavorite) {
      result = await this.favoriteService.addToFavorites(userId, offerId);
    } else {
      result = await this.favoriteService.removeFromFavorites(userId, offerId);
    }

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'FavoriteController'
      );
    }

    this.ok(res, plainToInstance(OfferRdo, result, { excludeExtraneousValues: true }));
  }
} 