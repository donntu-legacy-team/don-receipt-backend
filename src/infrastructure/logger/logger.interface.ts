export interface ILogger {
  info(message: string, context?: any): void;
  error(message: string, context?: any): void;
  debug(message: string, context?: any): void;
  warn(message: string, context?: Record<string, any>): void;
  trace(message: string, context?: Record<string, any>): void;
}
