import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

convict.addFormat({
  name: 'required-port',
  validate: function(val) {
    if (val === null || val === undefined) {
      throw new Error('Required value is missing');
    }
    if (val < 0 || val > 65535) {
      throw new Error('Ports must be within range 0 - 65535');
    }
  }
});

export type ConfigSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: string;
  UPLOAD_DIRECTORY: string;
  JWT_SECRET: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'required-port',
    env: 'PORT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server',
    format: (val) => {
      if (val === null || val === undefined) {
        throw new Error('DB_HOST is required');
      }
      validator.ipaddress.validate(val);
    },
    env: 'DB_HOST',
    default: null
  },
  DB_USER: {
    doc: 'Username to connect to MongoDB',
    format: String,
    env: 'DB_USER',
    default: ''
  },
  DB_PASSWORD: {
    doc: 'Password to connect to MongoDB',
    format: String,
    env: 'DB_PASSWORD',
    default: ''
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
  DB_PORT: {
    doc: 'Database port',
    format: String,
    env: 'DB_PORT',
    default: '27017'
  },
  SALT: {
    doc: 'Salt for password hash',
    format: (val) => {
      if (val === null || val === undefined || val === '') {
        throw new Error('SALT is required');
      }
    },
    env: 'SALT',
    default: null
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for uploaded files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: 'uploads'
  },
  JWT_SECRET: {
    doc: 'Secret key for JWT tokens',
    format: (val) => {
      if (val === null || val === undefined || val === '') {
        throw new Error('JWT_SECRET is required');
      }
    },
    env: 'JWT_SECRET',
    default: null
  }
});
