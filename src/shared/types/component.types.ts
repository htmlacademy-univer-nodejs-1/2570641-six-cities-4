export const COMPONENT = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserModel: Symbol.for('UserModel'),
  OfferModel: Symbol.for('OfferModel'),
  UserRepositoryInterface: Symbol.for('UserRepositoryInterface'),
  OfferRepositoryInterface: Symbol.for('OfferRepositoryInterface'),
  UserService: Symbol.for('UserService'),
  OfferService: Symbol.for('OfferService'),
} as const;
