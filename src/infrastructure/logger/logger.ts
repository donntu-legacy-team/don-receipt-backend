import { getLogger, Logger } from 'log4js';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Log4jsLogger implements ILogger {
  private readonly logger: Logger;

  constructor(category: string = 'default') {
    this.logger = getLogger(category);
    this.logger.level = 'info'; // TODO: разобраться, как задать level в конфигурации, а не тут
  }

  info(message: string, context?: any) {
    if (context) {
      const ctx = typeof context === 'object'
        ? JSON.stringify(context, null, 2)
        : context;
      this.logger.info(`${message}\n${ctx}`);
    } else {
      this.logger.info(message);
    }
  }

  error(message: string, context?: any) {
    if (context) {
      const ctx = typeof context === 'object'
        ? JSON.stringify(context, null, 2)
        : context;
      this.logger.error(`${message}\n${ctx}`);
    } else {
      this.logger.error(message);
    }
  }

  debug(message: string, context?: any) {
    if (context) {
      const ctx = typeof context === 'object'
        ? JSON.stringify(context, null, 2)
        : context;
      this.logger.debug(`${message}\n${ctx}`);
    } else {
      this.logger.debug(message);
    }
  }

  warn(message: string, context?: any) {
    if (context) {
      const ctx = typeof context === 'object'
        ? JSON.stringify(context, null, 2)
        : context;
      this.logger.warn(`${message}\n${ctx}`);
    } else {
      this.logger.warn(message);
    }
  }

  trace(message: string, context?: any) {
    if (context) {
      const ctx = typeof context === 'object'
        ? JSON.stringify(context, null, 2)
        : context;
      this.logger.trace(`${message}\n${ctx}`);
    } else {
      this.logger.trace(message);
    }
  }
}
