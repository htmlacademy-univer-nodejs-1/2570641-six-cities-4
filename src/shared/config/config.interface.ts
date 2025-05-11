export interface ConfigInterface {
  get<T>(key: string): T;
  getMongoURI(): string;
}
