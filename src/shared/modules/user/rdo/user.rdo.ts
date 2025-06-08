import { Expose } from 'class-transformer';
import { UserType } from '../user-type.enum.js';

export class UserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar?: string;

  @Expose()
  public type!: UserType;
} 