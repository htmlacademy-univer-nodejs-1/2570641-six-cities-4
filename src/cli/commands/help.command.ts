import { injectable } from 'inversify';
import { Command } from './command.interface.js';
import chalk from 'chalk';

@injectable()
export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            ${chalk.blue('--version:')}                   # выводит номер версии
            ${chalk.blue('--help:')}                      # печатает этот текст
            ${chalk.blue('--import <path>:')}             # импортирует данные из TSV
            ${chalk.blue('--generate <n> <path> <url>')}  # генерирует произвольное количество тестовых данных
    `));
  }
}
