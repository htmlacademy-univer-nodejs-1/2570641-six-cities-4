import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { UserRepositoryInterface } from './user-repository.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { types } from '../../container/types.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { ConfigInterface } from '../../config/config.interface.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(types.UserRepositoryInterface) private readonly userRepository: UserRepositoryInterface,
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(types.ConfigInterface) private readonly config: ConfigInterface
  ) {}

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userRepository.findById(userId);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userRepository.findByEmail(email);
  }

  public async create(dto: CreateUserDto, password: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity();
    user.name = dto.name;
    user.email = dto.email;
    user.type = dto.type;
    user.setPassword(password, this.config.get<string>('SALT'));

    this.logger.info(`Creating new user: ${user.email}`);
    return this.userRepository.create(user);
  }

  public async verifyUser(dto: LoginUserDto, password: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(password, this.config.get<string>('SALT'))) {
      return user;
    }

    return null;
  }

  public async checkUserExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  public async exists(documentId: string): Promise<boolean> {
    const user = await this.findById(documentId);
    return user !== null;
  }

  public async updateAvatar(userId: string, avatarPath: string): Promise<DocumentType<UserEntity> | null> {
    this.logger.info(`Updating avatar for user ${userId}`);
    return this.userRepository.updateAvatar(userId, avatarPath);
  }


}
