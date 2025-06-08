import 'reflect-metadata';
import { Container } from 'inversify';
import { types } from './types.js';
import { Application } from '../../app/application.js';
import { CLIApplication } from '../../cli/cli-application.js';
import { FileReader } from '../libs/file-reader/file-reader.interface.js';
import { TSVFileReader } from '../libs/file-reader/tsv-file-reader.js';
import { TSVFileWriter } from '../libs/file-writer/tsv-file-writer.js';
import { LoggerInterface } from '../libs/logger/logger.interface.js';
import { PinoLogger } from '../libs/logger/pino-logger.js';
import { ConfigInterface } from '../config/config.interface.js';
import { Config } from '../config/config.js';
import { DatabaseInterface } from '../libs/database/database.interface.js';
import { MongoDatabase } from '../libs/database/mongo.database.js';
import { Command } from '../../cli/commands/command.interface.js';
import { HelpCommand } from '../../cli/commands/help.command.js';
import { VersionCommand } from '../../cli/commands/version.command.js';
import { ImportCommand } from '../../cli/commands/import.command.js';
import { GenerateCommand } from '../../cli/commands/generate.command.js';
import { OfferGenerator } from '../offer-generator/offer-generator.js';
import { UserEntity, OfferEntity } from '../modules/index.js';
import { UserService } from '../modules/user/user.service.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { OfferService } from '../modules/offer/offer.service.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
import { UserRepositoryInterface } from '../modules/user/user-repository.interface.js';
import { OfferRepositoryInterface } from '../modules/offer/offer-repository.interface.js';
import { DefaultUserRepository } from '../modules/user/default-user.repository.js';
import { DefaultOfferRepository } from '../modules/offer/default-offer.repository.js';
import { UserController } from '../modules/user/user.controller.js';
import { OfferController } from '../modules/offer/offer.controller.js';
import { FavoriteController } from '../modules/favorite/favorite.controller.js';
import { FavoriteServiceInterface } from '../modules/favorite/favorite-service.interface.js';
import { FavoriteService } from '../modules/favorite/favorite.service.js';
import { FavoriteRepositoryInterface } from '../modules/favorite/favorite-repository.interface.js';
import { DefaultFavoriteRepository } from '../modules/favorite/default-favorite.repository.js';
import { FavoriteEntity } from '../modules/favorite/favorite.entity.js';
import { CommentEntity } from '../modules/comment/comment.entity.js';
import { CommentService } from '../modules/comment/comment.service.js';
import { CommentServiceInterface } from '../modules/comment/comment-service.interface.js';
import { CommentRepositoryInterface } from '../modules/comment/comment-repository.interface.js';
import { DefaultCommentRepository } from '../modules/comment/default-comment.repository.js';
import { CommentController } from '../modules/comment/comment.controller.js';
import { AppExceptionFilter, HttpExceptionFilter, ValidationExceptionFilter, ControllerInterface, ExceptionFilter } from '../libs/rest/index.js';
import { getModelForClass } from '@typegoose/typegoose';
import { AuthService, DefaultAuthService, AuthExceptionFilter } from '../modules/auth/index.js';

const container = new Container();

// App
container.bind<Application>(types.Application).to(Application).inSingletonScope();
container.bind<LoggerInterface>(types.LoggerInterface).to(PinoLogger).inSingletonScope();
container.bind<ConfigInterface>(types.ConfigInterface).to(Config).inSingletonScope();
container.bind<DatabaseInterface>(types.DatabaseInterface).to(MongoDatabase).inSingletonScope();

// Services
container.bind<UserServiceInterface>(types.UserServiceInterface).to(UserService).inSingletonScope();
container.bind<OfferServiceInterface>(types.OfferServiceInterface).to(OfferService).inSingletonScope();
container.bind<FavoriteServiceInterface>(types.FavoriteServiceInterface).to(FavoriteService).inSingletonScope();
container.bind<CommentServiceInterface>(types.CommentServiceInterface).to(CommentService).inSingletonScope();
container.bind<AuthService>(types.AuthService).to(DefaultAuthService).inSingletonScope();

// Repositories
container.bind<UserRepositoryInterface>(types.UserRepositoryInterface).to(DefaultUserRepository).inSingletonScope();
container.bind<OfferRepositoryInterface>(types.OfferRepositoryInterface).to(DefaultOfferRepository).inSingletonScope();
container.bind<FavoriteRepositoryInterface>(types.FavoriteRepositoryInterface).to(DefaultFavoriteRepository).inSingletonScope();
container.bind<CommentRepositoryInterface>(types.CommentRepositoryInterface).to(DefaultCommentRepository).inSingletonScope();

// Controllers
container.bind<ControllerInterface>(types.UserController).to(UserController).inSingletonScope();
container.bind<ControllerInterface>(types.OfferController).to(OfferController).inSingletonScope();
container.bind<ControllerInterface>(types.FavoriteController).to(FavoriteController).inSingletonScope();
container.bind<ControllerInterface>(types.CommentController).to(CommentController).inSingletonScope();

// Models
container.bind(types.UserModel).toConstantValue(getModelForClass(UserEntity));
container.bind(types.OfferModel).toConstantValue(getModelForClass(OfferEntity));
container.bind(types.FavoriteModel).toConstantValue(getModelForClass(FavoriteEntity));
container.bind(types.CommentModel).toConstantValue(getModelForClass(CommentEntity));

// Exception Filters
container.bind<ExceptionFilter>(types.AppExceptionFilter).to(AppExceptionFilter).inSingletonScope();
container.bind<ExceptionFilter>(types.HttpExceptionFilter).to(HttpExceptionFilter).inSingletonScope();
container.bind<ExceptionFilter>(types.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
container.bind<ExceptionFilter>(types.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

// CLI
container.bind<CLIApplication>(types.CLIApplication).to(CLIApplication).inSingletonScope();
container.bind<Command>(types.HelpCommand).to(HelpCommand);
container.bind<Command>(types.VersionCommand).to(VersionCommand);
container.bind<Command>(types.ImportCommand).to(ImportCommand);
container.bind<Command>(types.GenerateCommand).to(GenerateCommand);

// Utils
container.bind<FileReader>(types.FileReader).to(TSVFileReader);
container.bind<TSVFileWriter>(types.TSVFileWriter).to(TSVFileWriter).inSingletonScope();
container.bind<OfferGenerator>(types.OfferGenerator).to(OfferGenerator).inSingletonScope();

export { container };
