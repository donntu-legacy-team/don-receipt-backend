import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { Log4jsLogger } from '@/infrastructure/logger/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: ILogger;
  constructor() {
    this.logger = new Log4jsLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const body = context.switchToHttp().getResponse<Response>().body;

    return next.handle().pipe(
      map(() => {
        this.logger.info(`Response: `, {
          body: body,
        });
      }),
    );
  }
}
