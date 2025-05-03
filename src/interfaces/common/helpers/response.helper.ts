import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export function successResponse<T>(
  res: Response,
  data: T,
  statusCode: number = HttpStatus.OK,
) {
  return res.status(statusCode).json(data);
}

export function successResponseMessage(
  res: Response,
  message: string,
  statusCode: number = HttpStatus.OK,
) {
  return res.status(statusCode).json({ message });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = HttpStatus.NOT_FOUND,
) {
  return res.status(statusCode).json({ message });
}
