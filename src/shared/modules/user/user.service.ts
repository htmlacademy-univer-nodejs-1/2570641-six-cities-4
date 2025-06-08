import { inject, injectable } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { UserRepositoryInterface } from './user-repository.interface.js';
import { COMPONENT } from '../../types/component.types.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import * as crypto from 'node:crypto';

@injectable()
export class UserService {
  constructor(
    @inject(COMPONENT.UserRepositoryInterface) private readonly userRepository: UserRepositoryInterface,
    @inject(COMPONENT.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userRepository.findById(userId);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userRepository.findByEmail(email);
  }

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = {
      ...dto,
      password: await this.hashPassword(dto.password)
    };

    this.logger.info(`Creating new user: ${user.email}`);
    return this.userRepository.create(user);
  }

  public async verifyUser(dto: LoginUserDto): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (await this.comparePassword(dto.password, user.password)) {
      return user;
    }

    return null;
  }

  public async checkUserExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        1000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) {
            reject(err);
          }
          resolve(`${salt}:${derivedKey.toString('hex')}`);
        }
      );
    });
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(':');
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        1000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) {
            reject(err);
          }
          resolve(derivedKey.toString('hex') === storedHash);
        }
      );
    });
  }
}
