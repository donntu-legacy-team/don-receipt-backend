import { Response } from 'express';

export function successResponse<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
) {
  return res.status(statusCode).json(data);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 404,
) {
  return res.status(statusCode).json({ message });
}

export function errorResponseWithData<T>(
  res: Response,
  data: T,
  statusCode: number = 404,
) {
  return res.status(statusCode).json(data);
}
