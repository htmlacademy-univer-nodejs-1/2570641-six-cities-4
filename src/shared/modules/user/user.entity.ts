import { prop, modelOptions } from '@typegoose/typegoose';
import { BaseEntity } from '../base/base-entity.js';
import { UserType } from './user-type.enum.js';
import { createSHA256 } from '../../helpers/hash.js';

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

  @prop({ required: true })
  private password!: string;

  @prop({ required: true, enum: UserType, type: () => String, default: UserType.Regular })
  public type!: UserType;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string): boolean {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}
