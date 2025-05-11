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
  SALT: process.env.SALT
});

if (process.env.PORT) {
  configSchema.set('PORT', parseInt(process.env.PORT, 10));
}
if (process.env.DB_HOST) {
  configSchema.set('DB_HOST', process.env.DB_HOST);
}
if (process.env.SALT) {
  configSchema.set('SALT', process.env.SALT);
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
}

export function getConfig(): ConfigSchema {
  configSchema.validate({ allowed: 'strict' });

  const config = configSchema.getProperties();

  const missingVars = Object.entries(config)
    .filter(([_, value]) => value === null)
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
