import { IsString, Length, IsInt, Min, Max, IsMongoId } from 'class-validator';
import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../../user/user.entity.js';
import { OfferEntity } from '../../offer/offer.entity.js';

export class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'text must be between 5 and 1024 characters' })
  public text!: string;

  @IsInt({ message: 'rating must be an integer' })
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  public rating!: number;

  @IsMongoId({ message: 'userId must be a valid ObjectId' })
  public userId!: Ref<UserEntity>;

  @IsMongoId({ message: 'offerId must be a valid ObjectId' })
  public offerId!: Ref<OfferEntity>;
}
