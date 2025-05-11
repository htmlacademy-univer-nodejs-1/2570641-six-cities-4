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
import { OfferService } from '../modules/offer/offer.service.js';
import { UserRepositoryInterface } from '../modules/user/user-repository.interface.js';
import { OfferRepositoryInterface } from '../modules/offer/offer-repository.interface.js';
import { DefaultUserRepository } from '../modules/user/default-user.repository.js';
import { DefaultOfferRepository } from '../modules/offer/default-offer.repository.js';
import { COMPONENT } from '../types/component.types.js';
import { getModelForClass } from '@typegoose/typegoose';

const container = new Container();

// App
container.bind<Application>(types.Application).to(Application).inSingletonScope();
container.bind<LoggerInterface>(types.LoggerInterface).to(PinoLogger).inSingletonScope();
container.bind<ConfigInterface>(types.ConfigInterface).to(Config).inSingletonScope();
container.bind<DatabaseInterface>(types.DatabaseInterface).to(MongoDatabase).inSingletonScope();

// Services
container.bind<UserService>(COMPONENT.UserService).to(UserService).inSingletonScope();
container.bind<OfferService>(COMPONENT.OfferService).to(OfferService).inSingletonScope();

// Repositories
container.bind<UserRepositoryInterface>(COMPONENT.UserRepositoryInterface).to(DefaultUserRepository).inSingletonScope();
container.bind<OfferRepositoryInterface>(COMPONENT.OfferRepositoryInterface).to(DefaultOfferRepository).inSingletonScope();

// Models
container.bind(COMPONENT.UserModel).toConstantValue(getModelForClass(UserEntity));
container.bind(COMPONENT.OfferModel).toConstantValue(getModelForClass(OfferEntity));

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
