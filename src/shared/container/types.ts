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

  UserController: Symbol.for('UserController'),
  OfferController: Symbol.for('OfferController'),
  FavoriteController: Symbol.for('FavoriteController'),
  CommentController: Symbol.for('CommentController'),

  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserRepositoryInterface: Symbol.for('UserRepositoryInterface'),

  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferRepositoryInterface: Symbol.for('OfferRepositoryInterface'),

  FavoriteServiceInterface: Symbol.for('FavoriteServiceInterface'),
  FavoriteRepositoryInterface: Symbol.for('FavoriteRepositoryInterface'),

  CommentService: Symbol.for('CommentService'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentRepositoryInterface: Symbol.for('CommentRepositoryInterface'),

  UserModel: Symbol.for('UserModel'),
  OfferModel: Symbol.for('OfferModel'),
  FavoriteModel: Symbol.for('FavoriteModel'),
  CommentModel: Symbol.for('CommentModel'),

  AppExceptionFilter: Symbol.for('AppExceptionFilter'),
  HttpExceptionFilter: Symbol.for('HttpExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),

  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),
} as const;
