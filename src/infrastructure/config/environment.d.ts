declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT?: 'dev' | 'prod';
      HTTP_HOST?: string;
      HTTP_PORT?: string;
      POSTGRES_HOST?: string;
      POSTGRES_PORT?: string;
      POSTGRES_USERNAME?: string;
      POSTGRES_PASSWORD?: string;
      POSTGRES_DATABASE?: string;

      BCRYPT_SALT_ROUNDS?: string;
    }
  }
}

export {};
