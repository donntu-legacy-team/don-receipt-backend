import { getLogger, Logger } from 'log4js';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Log4jsLogger implements ILogger {
  private readonly logger: Logger;

  constructor(category: string = 'default') {
    this.logger = getLogger(category);
    this.logger.level = 'info';
  }

  private formatContext(context: any): string {
    return typeof context === 'object'
      ? JSON.stringify(context, null, 2)
      : context;
  }

  info(message: string, context?: any) {
    if (context) {
      this.logger.info(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.info(message);
    }
  }

  error(message: string, context?: any) {
    if (context) {
      this.logger.error(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.error(message);
    }
  }

  debug(message: string, context?: any) {
    if (context) {
      this.logger.debug(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.debug(message);
    }
  }

  warn(message: string, context?: any) {
    if (context) {
      this.logger.warn(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.warn(message);
    }
  }

  trace(message: string, context?: any) {
    if (context) {
      this.logger.trace(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.trace(message);
    }
  }
}
