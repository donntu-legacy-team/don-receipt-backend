import { Request } from 'express';
import { config } from '@/infrastructure/config';

export function formatResponseLog(
  req: Request,
  formattedHeaders: string,
  responseBody: unknown,
) {
  return {
    method: req.method,
    url: req.url,
    headers: formattedHeaders,
    response: responseBody,
  };
}

export function formatRequestLog(req: Request): string {
  const { method, originalUrl, headers, query } = req;
  const body = req.body as Record<string, unknown>;

  const sanitizedBody = { ...body };
  if ('password' in sanitizedBody) {
    sanitizedBody.password = '***';
  }

  const formattedHeaders = Object.entries(headers)
    .filter(([key]) => !config().logging.excludedHeaders.has(key.toLowerCase()))
    .map(([key, value]) => `${key}: ${value as any}`)
    .join('\n');

  const logSections = [
    `${method} ${originalUrl}`,
    `Headers:\n${formattedHeaders}`,
  ];

  if (Object.keys(query).length > 0) {
    const formattedParams = Object.entries(query)
      .map(([key, value]) => `${key}: ${value as any}`)
      .join('\n');
    logSections.push(`Params:\n${formattedParams}`);
  }

  const formattedBody =
    typeof sanitizedBody === 'object'
      ? JSON.stringify(sanitizedBody, null, 2)
      : sanitizedBody;

  logSections.push(`Body:\n${formattedBody}`);

  return logSections.join('\n').trim();
}
