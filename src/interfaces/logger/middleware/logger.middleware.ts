import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Log4jsLogger } from '@/infrastructure/logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: ILogger;
  constructor() {
    this.logger = new Log4jsLogger();
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info('Request: ', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body as Record<string, unknown>,
      headers: req.headers,
    });

    next();
  }
}
