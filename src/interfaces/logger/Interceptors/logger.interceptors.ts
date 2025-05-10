import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ILogger } from '@/infrastructure/logger';
import { formatResponseLog } from '@/infrastructure/utils/log-formatter';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('ILogger') private readonly logger: ILogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const originalSend = res.send.bind(res);
    res.send = (body: unknown) => {
      try {
        const json: unknown = JSON.parse(body as string);
        this.logger.info('Response: ', formatResponseLog(req, res, json));
      } catch {
        this.logger.info('Response: ', formatResponseLog(req, res, body));
      }
      res.send = originalSend;
      return res.send(body);
    };

    return next.handle();
  }
}
