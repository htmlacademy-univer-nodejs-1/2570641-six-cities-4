#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication } from './cli/index.js';
import { container, types } from './shared/container/index.js';
import { Command } from './cli/commands/command.interface.js';

async function bootstrap() {
  const cliApplication = container.get<CLIApplication>(types.CLIApplication);

  const commands = [
    container.get<Command>(types.HelpCommand),
    container.get<Command>(types.VersionCommand),
    container.get<Command>(types.ImportCommand),
    container.get<Command>(types.GenerateCommand),
  ];

  cliApplication.registerCommands(commands);
  await cliApplication.processCommand(process.argv);
}

bootstrap().catch(console.error);
