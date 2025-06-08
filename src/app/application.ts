import { injectable, inject } from 'inversify';
import express, { Express } from 'express';
import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import { ConfigInterface } from '../shared/config/config.interface.js';
import { DatabaseInterface } from '../shared/libs/database/database.interface.js';
import { types } from '../shared/container/types.js';
import { ControllerInterface, ExceptionFilter, ParseTokenMiddleware } from '../shared/libs/rest/index.js';

@injectable()
export class Application {
  private readonly server: Express;

  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(types.ConfigInterface) private readonly config: ConfigInterface,
    @inject(types.DatabaseInterface) private readonly databaseClient: DatabaseInterface,
    @inject(types.UserController) private readonly userController: ControllerInterface,
    @inject(types.OfferController) private readonly offerController: ControllerInterface,
    @inject(types.FavoriteController) private readonly favoriteController: ControllerInterface,
    @inject(types.CommentController) private readonly commentController: ControllerInterface,
    @inject(types.AppExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(types.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(types.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter,
    @inject(types.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb(): Promise<void> {
    const mongoUri = this.config.getMongoURI();
    await this.databaseClient.connect(mongoUri);
  }

  private async initServer(): Promise<void> {
    const port = this.config.get<number>('PORT');
    this.server.listen(port);
    this.logger.info(`🚀 Server started on http://localhost:${port}`);
  }

  private async initControllers(): Promise<void> {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/favorites', this.favoriteController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async initMiddleware(): Promise<void> {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get<string>('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));

    const uploadDirectory = this.config.get<string>('UPLOAD_DIRECTORY');
    this.server.use('/static', express.static(uploadDirectory));
  }

  private async initExceptionFilters(): Promise<void> {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization...');

    this.logger.info('Init database…');
    await this.initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this.initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this.initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this.initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server…');
    await this.initServer();
    this.logger.info('Application initialized');
  }
}
