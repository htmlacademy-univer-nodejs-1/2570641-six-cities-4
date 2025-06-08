import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseEntity } from '../base/base-entity.js';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  }
})
export class FavoriteEntity extends BaseEntity {
  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, ref: OfferEntity })
  public offerId!: Ref<OfferEntity>;
}
