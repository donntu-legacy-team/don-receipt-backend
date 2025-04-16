import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Log4jsLogger } from '@/infrastructure/logger/logger';
import { excludedHeaders } from '@/interfaces/constants/header.constant';

interface ExtendedResponse extends Response {
  _loggedResponse: boolean;
}

// добавить логгирование заголовков йоу
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: ILogger;
  constructor() {
    this.logger = new Log4jsLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<ExtendedResponse>();

    res._loggedResponse = false;

    const formattedHeaders = Object.entries(res.getHeaders())
      .filter(([key]) => !excludedHeaders.has(key.toLowerCase()))
      .map(([key, value]) => `${key}: ${value as any}`)
      .join('\n');

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      if (!res._loggedResponse) {
        res._loggedResponse = true;
        this.logger.info('Response: ', {
          method: req.method,
          header: formattedHeaders,
          url: req.url,
          response: body,
        });
      }
      return originalJson(body);
    };

    const originalSend = res.send.bind(res);
    res.send = (body: unknown) => {
      if (!res._loggedResponse) {
        res._loggedResponse = true;
        try {
          const json: unknown = JSON.parse(body as string);
          this.logger.info('Response: ', {
            method: req.method,
            header: formattedHeaders,
            url: req.url,
            response: json,
          });
        } catch {
          this.logger.info('Response: ', {
            method: req.method,
            header: formattedHeaders,
            url: req.url,
            response: body,
          });
        }
      }
      return originalSend(body);
    };

    return next.handle();
  }
}
