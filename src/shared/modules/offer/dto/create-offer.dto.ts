import { IsString, Length, IsEnum, IsUrl, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsInt, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { City } from '../city.enum.js';
import { OfferType } from '../offer-type.enum.js';
import { Amenity } from '../amenity.enum.js';
import { LocationDto } from './location.dto.js';
import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../user/user.entity.js';

export class CreateOfferDto {
  @IsString({ message: 'title is required' })
  @Length(10, 100, { message: 'title must be between 10 and 100 characters' })
  public title!: string;

  @IsString({ message: 'description is required' })
  @Length(20, 1024, { message: 'description must be between 20 and 1024 characters' })
  public description!: string;

  @IsEnum(City, { message: 'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf' })
  public city!: City;

  @IsString({ message: 'previewImage is required' })
  @IsUrl({}, { message: 'previewImage must be a valid URL' })
  public previewImage!: string;

  @IsArray({ message: 'images must be an array' })
  @ArrayMinSize(6, { message: 'images must contain exactly 6 items' })
  @ArrayMaxSize(6, { message: 'images must contain exactly 6 items' })
  @IsUrl({}, { each: true, message: 'each image must be a valid URL' })
  public images!: string[];

  @IsBoolean({ message: 'isPremium must be a boolean' })
  public isPremium!: boolean;

  @IsEnum(OfferType, { message: 'type must be one of: apartment, house, room, hotel' })
  public type!: OfferType;

  @IsInt({ message: 'roomCount must be an integer' })
  @Min(1, { message: 'roomCount must be at least 1' })
  @Max(8, { message: 'roomCount must be at most 8' })
  public roomCount!: number;

  @IsInt({ message: 'guestCount must be an integer' })
  @Min(1, { message: 'guestCount must be at least 1' })
  @Max(10, { message: 'guestCount must be at most 10' })
  public guestCount!: number;

  @IsInt({ message: 'price must be an integer' })
  @Min(100, { message: 'price must be at least 100' })
  @Max(100000, { message: 'price must be at most 100000' })
  public price!: number;

  @IsArray({ message: 'amenities must be an array' })
  @IsEnum(Amenity, { each: true, message: 'each amenity must be one of: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge' })
  public amenities!: Amenity[];

  public userId!: Ref<UserEntity>;

  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}
