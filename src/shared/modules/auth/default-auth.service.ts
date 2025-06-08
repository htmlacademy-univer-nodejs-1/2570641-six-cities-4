import { inject, injectable } from 'inversify';
import { createSecretKey } from 'node:crypto';
import { SignJWT } from 'jose';
import { DocumentType } from '@typegoose/typegoose';
import { AuthService } from './auth-service.interface.js';
import { types } from '../../container/types.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { TokenPayload } from './types/token-payload.type.js';
import { ConfigInterface } from '../../config/config.interface.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(types.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(types.ConfigInterface) private readonly config: ConfigInterface,
  ) {}

  public async authenticate(user: DocumentType<UserEntity>): Promise<string> {
    const jwtSecret = this.config.get<string>('JWT_SECRET');
    this.logger.info(`JWT_SECRET: ${jwtSecret ? 'present' : 'missing'}`);
    const secretKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<DocumentType<UserEntity>> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get<string>('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
