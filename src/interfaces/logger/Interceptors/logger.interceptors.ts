import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ILogger } from '@/infrastructure/logger';
import { config } from '@/infrastructure/config';
import { formatResponseLog } from '@/infrastructure/utils/log-formatter';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('ILogger') private readonly logger: ILogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const formattedHeaders = Object.entries(res.getHeaders())
      .filter(
        ([key]) => !config().logging.excludedHeaders.has(key.toLowerCase()),
      )
      .map(([key, value]) => `${key}: ${value as any}`)
      .join('\n');

    const originalSend = res.send.bind(res);
    res.send = (body: unknown) => {
      try {
        const json: unknown = JSON.parse(body as string);
        this.logger.info(
          'Response: ',
          formatResponseLog(req, formattedHeaders, json),
        );
      } catch {
        this.logger.info(
          'Response: ',
          formatResponseLog(req, formattedHeaders, body),
        );
      }
      res.send = originalSend;
      return res.send(body);
    };

    return next.handle();
  }
}
