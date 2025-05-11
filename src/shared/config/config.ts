import { configSchema, ConfigSchema } from './schema.js';
import path from 'node:path';
import * as dotenv from 'dotenv';

function loadEnvFile() {
  try {
    const cwd = process.cwd();
    const envPath = path.join(cwd, '.env');

    // Используем dotenv для загрузки файла .env
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

// Manually set the values in schema based on environment variables
if (process.env.PORT) {
  configSchema.set('PORT', parseInt(process.env.PORT, 10));
}
if (process.env.DB_HOST) {
  configSchema.set('DB_HOST', process.env.DB_HOST);
}
if (process.env.SALT) {
  configSchema.set('SALT', process.env.SALT);
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
