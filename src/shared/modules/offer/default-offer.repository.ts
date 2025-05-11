import { injectable, inject } from 'inversify';
import { Model } from 'mongoose';
import { OfferEntity } from './offer.entity.js';
import { OfferRepositoryInterface } from './offer-repository.interface.js';
import { DocumentType } from '@typegoose/typegoose';
import { COMPONENT } from '../../types/component.types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';

@injectable()
export class DefaultOfferRepository implements OfferRepositoryInterface {
  constructor(
    @inject(COMPONENT.OfferModel) private readonly offerModel: Model<OfferEntity>,
    @inject(COMPONENT.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    this.logger.info(`Looking for offer with ID: ${id}`);
    return this.offerModel.findById(id).exec() as Promise<DocumentType<OfferEntity> | null>;
  }

  public async create(item: Omit<OfferEntity, '_id'>): Promise<DocumentType<OfferEntity>> {
    this.logger.info('Creating a new offer', { title: item.title });
    return this.offerModel.create(item) as unknown as DocumentType<OfferEntity>;
  }
}
