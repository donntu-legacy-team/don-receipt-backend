import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Log4jsLogger } from '@/infrastructure/logger';
import { config } from '@/infrastructure/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Log4jsLogger;

  constructor() {
    this.logger = new Log4jsLogger();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, query } = req;
    const body = req.body as Record<string, unknown>;

    const sanitizedBody = { ...body };

    if ('password' in sanitizedBody) {
      sanitizedBody.password = '***';
    }

    const formattedHeaders = Object.entries(headers)
      .filter(
        ([key]) => !config().logging.excludedHeaders.has(key.toLowerCase()),
      )
      .map(([key, value]) => `${key}: ${value as any}`)
      .join('\n');

    const logSections = [
      `${method} ${originalUrl}`,
      `Headers:\n${formattedHeaders}`,
    ];

    if (Object.keys(query).length > 0) {
      const formattedParams = Object.entries(query)
        .map(([key, value]) => `${key}: ${value as any}`)
        .join('\n');
      logSections.push(`Params:\n${formattedParams}`);
    }

    const formattedBody: any =
      typeof sanitizedBody === 'object'
        ? JSON.stringify(sanitizedBody, null, 2)
        : sanitizedBody;
    logSections.push(`Body:\n${formattedBody}`);

    const logMessage = logSections.join('\n').trim();

    this.logger.info(logMessage);
    next();
  }
}
