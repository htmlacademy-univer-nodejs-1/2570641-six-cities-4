import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import chalk from 'chalk';
import { logger } from '../shared/libs/logger/index.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        logger.error(`Command ${command.getName()} is already registered`);
        throw new Error(chalk.red(`Command ${command.getName()} is already registered`));
      }
      this.commands[command.getName()] = command;
      logger.info(`Command ${chalk.green(command.getName())} registered`);
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      logger.error(`The default command (${this.defaultCommand}) is not registered.`);
      throw new Error(chalk.red(`The default command (${this.defaultCommand}) is not registered.`));
    }
    return this.commands[this.defaultCommand];
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    logger.info(`Executing command: ${chalk.green(commandName)}`);
    await command.execute(...commandArguments);
  }
}
