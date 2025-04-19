import { Request } from 'express';

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
