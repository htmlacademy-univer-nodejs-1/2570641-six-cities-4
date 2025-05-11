import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from '../modules/user/user.entity.js';
import { OfferEntity } from '../modules/offer/offer.entity.js';

export type UserDocument = DocumentType<UserEntity>;
export type OfferDocument = DocumentType<OfferEntity>;
