import { getLogger, Logger } from 'log4js';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Log4jsLogger implements ILogger {
  private readonly logger: Logger;

  constructor(category: string = 'default') {
    this.logger = getLogger(category);
    this.logger.level = 'info'; // так не должно быть. Уровень логгировани определяется в конфигах
  }

  info(message: string, context?: any) {
    this.logger.info({ message, ...context });
  }

  error(message: string, context?: any) {
    this.logger.error({ message, ...context });
  }

  debug(message: string, context?: any) {
    this.logger.debug({ message, ...context });
  }

  warn(message: string, context?: Record<string, any>) {
    this.logger.warn({ message, ...context });
  }

  trace(message: string, context?: Record<string, any>) {
    this.logger.trace({ message, ...context });
  }
}
