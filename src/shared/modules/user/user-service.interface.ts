import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

export interface UserServiceInterface {
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  create(dto: CreateUserDto, password: string): Promise<DocumentType<UserEntity>>;
  verifyUser(dto: LoginUserDto, password: string): Promise<DocumentType<UserEntity> | null>;
  checkUserExists(email: string): Promise<boolean>;
}
