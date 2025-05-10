import { getLogger, Logger } from 'log4js';
import { Injectable } from '@nestjs/common';

export interface ILogger {
  info(message: string, context?: unknown): void;
  error(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  trace(message: string, context?: unknown): void;
}

@Injectable()
export class Log4jsLogger implements ILogger {
  private readonly logger: Logger;

  constructor(level: string = 'info') {
    this.logger = getLogger();
    this.logger.level = level;
  }

  private formatContext(context: unknown) {
    return context !== null && typeof context === 'object'
      ? JSON.stringify(context, null, 2)
      : String(context);
  }

  info(message: string, context?: unknown) {
    if (context) {
      this.logger.info(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.info(message);
    }
  }

  error(message: string, context?: unknown) {
    if (context) {
      this.logger.error(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.error(message);
    }
  }

  debug(message: string, context?: unknown) {
    if (context) {
      this.logger.debug(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.debug(message);
    }
  }

  warn(message: string, context?: unknown) {
    if (context) {
      this.logger.warn(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.warn(message);
    }
  }

  trace(message: string, context?: unknown) {
    if (context) {
      this.logger.trace(`${message}\n${this.formatContext(context)}`);
    } else {
      this.logger.trace(message);
    }
  }
}
