import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Log4jsLogger } from '@/infrastructure/logger/logger';
import { excludedHeaders } from '@/interfaces/constants/header.constant';

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
      const passwordValue = sanitizedBody.password;
      if (typeof passwordValue === 'string') {
        sanitizedBody.password = '*'.repeat(passwordValue.length);
      } else {
        sanitizedBody.password = '***';
      }
    }

    const formattedHeaders = Object.entries(headers)
      .filter(([key]) => !excludedHeaders.has(key.toLowerCase()))
      .map(([key, value]) => `${key}: ${value as any}`)
      .join('\n');

    const formattedParams = Object.entries(query)
      .map(([key, value]) => `${key}: ${value as any}`)
      .join('\n');

    const formattedBody: any =
      typeof sanitizedBody === 'object'
        ? JSON.stringify(sanitizedBody, null, 2)
        : sanitizedBody;

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

// if (formattedBody.hasOwnProperty('password')) {
//   const { password, ...bodyNoPassword } = formattedBody;
// }
