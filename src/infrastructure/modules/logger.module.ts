import { DynamicModule, Module } from '@nestjs/common';
import { Log4jsLogger } from '@/infrastructure/logger';
import { LoggingInterceptor } from '@/interfaces/logger/Interceptors/logger.interceptors';

@Module({})
export class LoggerModule {
  static forRoot(level: string = 'info'): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'ILogger',
          useFactory: () => new Log4jsLogger(level),
        },
        LoggingInterceptor,
      ],
      exports: ['ILogger', LoggingInterceptor],
    };
  }
}
