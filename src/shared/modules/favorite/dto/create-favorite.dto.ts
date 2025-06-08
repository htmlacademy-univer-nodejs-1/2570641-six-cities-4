import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../user/user.entity.js';
import { OfferEntity } from '../../offer/offer.entity.js';

export class CreateFavoriteDto {
  public userId!: Ref<UserEntity>;
  public offerId!: Ref<OfferEntity>;
}
