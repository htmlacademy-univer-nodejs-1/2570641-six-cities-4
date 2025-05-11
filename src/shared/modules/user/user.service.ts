import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { UserRepositoryInterface } from './user-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';

@injectable()
export class UserService {
  constructor(
    @inject(COMPONENT.UserRepositoryInterface) private readonly userRepository: UserRepositoryInterface
  ) {}

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userRepository.findById(userId);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userRepository.findByEmail(email);
  }

  public async create(userData: Omit<UserEntity, '_id'>): Promise<DocumentType<UserEntity>> {
    return this.userRepository.create(userData);
  }
}
