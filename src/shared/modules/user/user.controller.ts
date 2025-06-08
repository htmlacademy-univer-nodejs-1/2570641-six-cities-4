import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod, HttpError, ValidateDtoMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { LoggerInterface } from '../../libs/logger/logger.interface.js';
import { ConfigInterface } from '../../config/config.interface.js';
import { types } from '../../container/types.js';
import { UserServiceInterface } from './user-service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginRdo } from './rdo/login.rdo.js';
import { plainToInstance } from 'class-transformer';
import { UploadFileMiddleware, DocumentExistsMiddleware } from '../../libs/middleware/index.js';
import { AuthService } from '../auth/auth-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(types.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(types.ConfigInterface) private readonly configService: ConfigInterface,
    @inject(types.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(types.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/check',
      method: HttpMethod.Get,
      handler: this.checkUser,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
        new UploadFileMiddleware(this.configService.get<string>('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
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
    const user = await this.authService.verify(req.body);
    const token = await this.authService.authenticate(user);

    this.ok(res, plainToInstance(LoginRdo, { token, email: user.email }, { excludeExtraneousValues: true }));
  }

  public async checkUser(req: Request, res: Response): Promise<void> {
    const { email } = req.tokenPayload!;
    const foundUser = await this.userService.findByEmail(email);

    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, plainToInstance(UserRdo, foundUser, { excludeExtraneousValues: true }));
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const uploadFile = req.file;
    const { userId } = req.params;
    const { id: currentUserId } = req.tokenPayload!;

    if (userId !== currentUserId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied. You can only upload your own avatar.',
        'UserController'
      );
    }

    if (!uploadFile) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Avatar file is required',
        'UserController'
      );
    }

    const avatarPath = `/static/${uploadFile.filename}`;

    await this.userService.updateAvatar(userId, avatarPath);

    this.created(res, { avatarPath });
  }
}
