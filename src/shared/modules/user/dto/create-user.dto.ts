import { UserType } from '../user-type.enum.js';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public password!: string;
  public avatar?: string;
  public type!: UserType;
}
