import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Log4jsLogger } from '@/infrastructure/logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Log4jsLogger;

  constructor() {
    this.logger = new Log4jsLogger();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, query, body } = req;

    const excludedHeaders = new Set([ // (костыль чтобы убрать много ненужного) TODO: найти более элегантное решение
      'accept',
      'sec-ch-ua',
      'content-type',
      'sec-ch-ua-mobile',
      'origin',
      'sec-fetch-site',
      'sec-fetch-mode',
      'sec-fetch-dest',
      'referer',
      'accept-encoding',
      'accept-language',
    ]);

    const formattedHeaders = Object.entries(headers)
      .filter(([key]) => !excludedHeaders.has(key.toLowerCase()))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const formattedParams = Object.entries(query)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const formattedBody =
      typeof body === 'object'
        ? JSON.stringify(body, null, 2)
        : body;

    const logMessage = `${method} ${originalUrl}
Headers:
${formattedHeaders}
Params:
${formattedParams}
body:
${formattedBody}`;

    this.logger.info(logMessage);
    next();
  }
}
