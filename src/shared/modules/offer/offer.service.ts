import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { OfferRepositoryInterface } from './offer-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';

@injectable()
export class OfferService {
  constructor(
    @inject(COMPONENT.OfferRepositoryInterface) private readonly offerRepository: OfferRepositoryInterface
  ) {}

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerRepository.findById(offerId);
  }

  public async create(offerData: Omit<OfferEntity, '_id'>): Promise<DocumentType<OfferEntity>> {
    return this.offerRepository.create(offerData);
  }
}
