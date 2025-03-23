import * as process from 'node:process';

export const DEVELOPMENT_ENV_PATH = '.env.development';

export type Environment = 'dev' | 'prod';

export interface SecurityConfig {
  bcryptSaltRounds: number;
  jwtAccessSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
}

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
  security: SecurityConfig;
};

export const config = (): Configuration => {
  const isDev = process.env.ENVIRONMENT
    ? process.env.ENVIRONMENT === 'dev'
    : true;

  return {
    env: isDev ? 'dev' : 'prod',
    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? parseInt(process.env.HTTP_PORT, 10)
        : 3000,
    },
    database: {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT, 10)
        : 5433,
      username: process.env.POSTGRES_USERNAME ?? 'root',
      password: process.env.POSTGRES_PASSWORD ?? 'root',
      databaseName: process.env.POSTGRES_DATABASE ?? 'don_receipt',
      synchronize: isDev,
    },
    security: {
      bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS
        ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
        : 10,
      jwtAccessSecret:
        process.env.JWT_ACCESS_SECRET ||
        'DO_NOT_USE_THIS_SECRET',
      jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '2h',
      jwtRefreshSecret:
        process.env.JWT_REFRESH_SECRET ||
        'DO_NOT_USE_THIS_SECRET',
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '14d',
    },
  };
};
