import { DocumentType } from '@typegoose/typegoose';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';

export interface AuthService {
  authenticate(user: DocumentType<UserEntity>): Promise<string>;
  verify(dto: LoginUserDto): Promise<DocumentType<UserEntity>>;
}
