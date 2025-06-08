import { Expose } from 'class-transformer';

export class LoginRdo {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;
}
