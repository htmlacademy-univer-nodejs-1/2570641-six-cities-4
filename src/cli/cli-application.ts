import { injectable, inject } from 'inversify';
import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import chalk from 'chalk';
import { LoggerInterface } from '../shared/libs/logger/logger.interface.js';
import { types } from '../shared/container/types.js';

type CommandCollection = Record<string, Command>;

@injectable()
export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface,
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        this.logger.error(`Command ${command.getName()} is already registered`);
        throw new Error(chalk.red(`Command ${command.getName()} is already registered`));
      }
      this.commands[command.getName()] = command;
      this.logger.info(`Command ${chalk.green(command.getName())} registered`);
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      this.logger.error(`The default command (${this.defaultCommand}) is not registered.`);
      throw new Error(chalk.red(`The default command (${this.defaultCommand}) is not registered.`));
    }
    return this.commands[this.defaultCommand];
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    this.logger.info(`Executing command: ${chalk.green(commandName)}`);
    await command.execute(...commandArguments);
  }
}
