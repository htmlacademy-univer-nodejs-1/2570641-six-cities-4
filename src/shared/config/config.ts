import { injectable } from 'inversify';
import { configSchema, ConfigSchema } from './schema.js';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { ConfigInterface } from './config.interface.js';

function loadEnvFile() {
  try {
    const cwd = process.cwd();
    const envPath = path.join(cwd, '.env');

    const result = dotenv.config({ path: envPath });

    if (result.error) {
      console.error('Error loading .env file:', result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return false;
  }
}

const envLoaded = loadEnvFile();
console.log('Environment variables loaded:', !!envLoaded);
console.log('Environment variables:', {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[PRESENT]' : '[NOT_SET]',
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  SALT: process.env.SALT,
  JWT_SECRET: process.env.JWT_SECRET ? '[PRESENT]' : '[NOT_SET]'
});

if (process.env.PORT) {
  configSchema.set('PORT', parseInt(process.env.PORT, 10));
}
if (process.env.DB_HOST) {
  configSchema.set('DB_HOST', process.env.DB_HOST);
}
if (process.env.DB_USER) {
  configSchema.set('DB_USER', process.env.DB_USER);
}
if (process.env.DB_PASSWORD) {
  configSchema.set('DB_PASSWORD', process.env.DB_PASSWORD);
}
if (process.env.DB_NAME) {
  configSchema.set('DB_NAME', process.env.DB_NAME);
}
if (process.env.DB_PORT) {
  configSchema.set('DB_PORT', process.env.DB_PORT);
}
if (process.env.SALT) {
  configSchema.set('SALT', process.env.SALT);
}
if (process.env.JWT_SECRET) {
  configSchema.set('JWT_SECRET', process.env.JWT_SECRET);
}

@injectable()
export class Config implements ConfigInterface {
  private readonly config: ConfigSchema;

  constructor() {
    configSchema.validate({ allowed: 'strict' });
    this.config = configSchema.getProperties();
  }

  public get<T>(key: string): T {
    return this.config[key as keyof ConfigSchema] as T;
  }

  public getMongoURI(): string {
    const user = this.get<string>('DB_USER');
    const password = this.get<string>('DB_PASSWORD');
    const host = this.get<string>('DB_HOST');
    const port = this.get<string>('DB_PORT');
    const databaseName = this.get<string>('DB_NAME');

    if (user && password) {
      return `mongodb://${user}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
    }

    return `mongodb://${host}:${port}/${databaseName}`;
  }
}

export function getConfig(): ConfigSchema {
  configSchema.validate({ allowed: 'strict' });

  const config = configSchema.getProperties();

  const missingVars = Object.entries(config)
    .filter(([key, value]) => value === null && ['PORT', 'DB_HOST', 'SALT', 'JWT_SECRET'].includes(key))
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file or environment settings.'
    );
  }

  return config;
}

export const config = getConfig();
