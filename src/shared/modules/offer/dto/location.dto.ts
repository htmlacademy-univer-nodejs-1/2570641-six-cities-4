import { IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber({}, { message: 'latitude must be a number' })
  public latitude!: number;

  @IsNumber({}, { message: 'longitude must be a number' })
  public longitude!: number;
}
