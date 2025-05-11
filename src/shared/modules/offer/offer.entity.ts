import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseEntity } from '../base/base-entity.js';
import { UserEntity } from '../user/user.entity.js';
import { OfferType } from './offer-type.enum.js';
import { City } from './city.enum.js';
import { Amenity } from './amenity.enum.js';
import { Location } from './location.type.js';

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends BaseEntity {
  @prop({ required: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public date!: Date;

  @prop({ required: true, enum: City, type: () => String })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String], default: [] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, enum: OfferType, type: () => String })
  public type!: OfferType;

  @prop({ required: true, min: 1, max: 8 })
  public roomCount!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestCount!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ required: true, type: () => [String], enum: Amenity, default: [] })
  public amenities!: Amenity[];

  @prop({ required: true, ref: UserEntity })
  public userId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({ required: true })
  public location!: Location;
}
