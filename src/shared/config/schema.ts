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
  SALT: {
    doc: 'Salt for password hash',
    format: (val) => {
      if (val === null || val === undefined || val === '') {
        throw new Error('SALT is required');
      }
    },
    env: 'SALT',
    default: null
  }
});
