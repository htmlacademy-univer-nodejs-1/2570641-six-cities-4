import { Expose } from 'class-transformer';
import { City } from '../city.enum.js';
import { OfferType } from '../offer-type.enum.js';

export class OfferPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public price!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public date!: string;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentCount!: number;
}
