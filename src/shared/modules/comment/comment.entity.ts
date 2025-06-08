import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseEntity } from '../base/base-entity.js';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends BaseEntity {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @prop({ required: true })
  public publishDate!: Date;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, ref: OfferEntity })
  public offerId!: Ref<OfferEntity>;
}
