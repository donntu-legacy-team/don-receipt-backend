import { Request, Response } from 'express';
import { config } from '@/infrastructure/config';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

export function formatHeaders(
  headers: IncomingHttpHeaders | OutgoingHttpHeaders,
) {
  return Object.entries(headers)
    .filter(([key]) => !config().logging.excludedHeaders.has(key.toLowerCase()))
    .map(([key, value]) => {
      const normalizedValue = Array.isArray(value) ? value.join(', ') : value;
      return `${key}: ${normalizedValue}`;
    })
    .join('\n');
}

export function formatResponseLog(
  req: Request,
  res: Response,
  responseBody: unknown,
) {
  const formattedHeaders = formatHeaders(res.getHeaders());
  return {
    method: req.method,
    url: req.url,
    headers: formattedHeaders,
    response: responseBody,
  };
}

export function formatRequestLog(req: Request) {
  const { method, originalUrl, headers, query } = req;

  const formattedHeaders = formatHeaders(headers);

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

  if (req.body === undefined || req.body === null) {
    logSections.push('Body:\n{}');
  } else if (typeof req.body === 'object') {
    const body = req.body as Record<string, unknown>;
    const sanitizedBody = { ...body };

    if ('password' in sanitizedBody) {
      sanitizedBody.password = '***';
    }

    const formattedBody = JSON.stringify(sanitizedBody, null, 2);
    logSections.push(`Body:\n${formattedBody}`);
  } else {
    logSections.push(`Body:\n${String(req.body)}`);
  }

  return logSections.join('\n').trim();
}
