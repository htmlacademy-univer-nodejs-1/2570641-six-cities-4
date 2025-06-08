import { IsString, Length, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '../user-type.enum.js';

export class CreateUserDto {
  @IsString({ message: 'name is required' })
  @Length(1, 15, { message: 'name must be between 1 and 15 characters' })
  public name!: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  public email!: string;

  @IsString({ message: 'password is required' })
  @Length(6, 12, { message: 'password must be between 6 and 12 characters' })
  public password!: string;

  @IsOptional()
  @IsString({ message: 'avatar must be a string' })
  public avatar?: string;

  @IsEnum(UserType, { message: 'type must be one of: regular, pro' })
  public type!: UserType;
}
