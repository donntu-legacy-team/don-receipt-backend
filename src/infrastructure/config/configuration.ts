import * as process from 'node:process';

export const DEVELOPMENT_ENV_PATH = '' +
  '.env.development';

export type Environment = 'dev' | 'prod';

export type Configuration = {
  env: Environment;
  http: {
    host: string;
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    databaseName: string;
    synchronize: boolean;
  };
};

export const config = (): Configuration => {
  const isDev = process.env.ENVIRONMENT
    ? process.env.ENVIRONMENT === 'dev'
    : true;

  return {
    env: isDev ? 'dev' : 'prod',
    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3000,
    },
    database: {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT)
        : 5432,
      username: process.env.POSTGRES_USERNAME ?? 'root',
      password: process.env.POSTGRES_PASSWORD ?? 'root',
      databaseName: process.env.POSTGRES_DATABASE ?? 'don_receipt',
      synchronize: isDev,
    },
  };
};
