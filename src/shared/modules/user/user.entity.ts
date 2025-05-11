import { prop, modelOptions } from '@typegoose/typegoose';
import { BaseEntity } from '../base/base-entity.js';
import { UserType } from './user-type.enum.js';

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends BaseEntity {
  @prop({ required: true, minlength: 1, maxlength: 15 })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ default: 'default-avatar.png' })
  public avatar?: string;

  @prop({ required: true, minlength: 6, maxlength: 12 })
  public password!: string;

  @prop({ required: true, enum: UserType, type: () => String, default: UserType.Regular })
  public type!: UserType;
}
