import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod, HttpError } from '../../libs/rest/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { types } from '../../container/types.js';
import { UserServiceInterface } from './user-service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginRdo } from './rdo/login.rdo.js';
import { plainToInstance } from 'class-transformer';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(types.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(types.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/check', method: HttpMethod.Get, handler: this.checkUser });
  }

  public async register(req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(req.body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${req.body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(req.body, req.body.password);
    this.created(res, plainToInstance(UserRdo, result, { excludeExtraneousValues: true }));
  }

  public async login(req: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, res: Response): Promise<void> {
    const user = await this.userService.verifyUser(req.body, req.body.password);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = 'mock_jwt_token'; // TODO: Generate real JWT token

    this.ok(res, plainToInstance(LoginRdo, { token, email: user.email }, { excludeExtraneousValues: true }));
  }

  public async checkUser(_req: Request, res: Response): Promise<void> {
    // TODO: Extract user from JWT token
    // Mock response for now
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      type: 'Regular'
    };

    this.ok(res, plainToInstance(UserRdo, mockUser, { excludeExtraneousValues: true }));
  }
} 