import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../user/user.entity.js';
import { OfferEntity } from '../../offer/offer.entity.js';

export class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public userId!: Ref<UserEntity>;
  public offerId!: Ref<OfferEntity>;
}
