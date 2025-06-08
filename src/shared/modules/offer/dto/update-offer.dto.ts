import { City } from '../city.enum.js';
import { OfferType } from '../offer-type.enum.js';
import { Amenity } from '../amenity.enum.js';
import { Location } from '../location.type.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: OfferType;
  public roomCount?: number;
  public guestCount?: number;
  public price?: number;
  public amenities?: Amenity[];
  public location?: Location;
}
