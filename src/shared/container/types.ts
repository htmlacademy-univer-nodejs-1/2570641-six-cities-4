export const types = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  FileReader: Symbol.for('FileReader'),
  TSVFileWriter: Symbol.for('TSVFileWriter'),
  OfferGenerator: Symbol.for('OfferGenerator'),

  CLIApplication: Symbol.for('CLIApplication'),
  HelpCommand: Symbol.for('HelpCommand'),
  VersionCommand: Symbol.for('VersionCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  GenerateCommand: Symbol.for('GenerateCommand'),
} as const;
