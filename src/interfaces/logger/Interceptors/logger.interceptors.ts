import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Log4jsLogger } from '@/infrastructure/logger/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: ILogger;
  constructor() {
    this.logger = new Log4jsLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    
    const resAny = res as any;
    resAny._loggedResponse = false;

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (!resAny._loggedResponse) {
        resAny._loggedResponse = true;
        this.logger.info('Response: ', {
          method: req.method,
          url: req.url,
          response: body, 
        });
      }
      return originalJson(body);
    };

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      if (!resAny._loggedResponse) {
        resAny._loggedResponse = true;
        try {
          const json = JSON.parse(body);
          this.logger.info('Response: ', {
            method: req.method,
            url: req.url,
            response: json,
          });
        } catch {
          this.logger.info('Response: ', {
            method: req.method,
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
