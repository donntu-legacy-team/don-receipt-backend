import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Log4jsLogger } from '@/infrastructure/logger/logger';

// Не обрабатывает пост-запросы
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: ILogger;
  constructor() {
    this.logger = new Log4jsLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        this.logger.info(`Response: `, {
          method: request.method,
          url: request.url,
          headers: response.headers,
          status: response.status,
          body: response.body,
        });
      }),
    );
  }
}
