import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '@/infrastructure/logger';
import { formatRequestLog } from '@/infrastructure/utils/log-formatter';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('ILogger') private readonly logger: ILogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const logMessage = formatRequestLog(req);
    this.logger.info(logMessage);
    next();
  }
}
