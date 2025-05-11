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

export function createApplicationContainer() {
  const container = new Container();

  container.bind<Application>(types.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(types.LoggerInterface).to(PinoLogger).inSingletonScope();
  container.bind<ConfigInterface>(types.ConfigInterface).to(Config).inSingletonScope();
  container.bind<DatabaseInterface>(types.DatabaseInterface).to(MongoDatabase).inSingletonScope();
  container.bind<FileReader>(types.FileReader).to(TSVFileReader);
  container.bind<TSVFileWriter>(types.TSVFileWriter).to(TSVFileWriter);
  container.bind<OfferGenerator>(types.OfferGenerator).to(OfferGenerator);

  container.bind<CLIApplication>(types.CLIApplication).to(CLIApplication).inSingletonScope();
  container.bind<Command>(types.HelpCommand).to(HelpCommand);
  container.bind<Command>(types.VersionCommand).to(VersionCommand);
  container.bind<Command>(types.ImportCommand).to(ImportCommand);
  container.bind<Command>(types.GenerateCommand).to(GenerateCommand);

  return container;
}
