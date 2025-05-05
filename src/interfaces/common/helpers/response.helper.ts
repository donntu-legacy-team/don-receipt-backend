import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export function successResponse<T>(
  res: Response,
  data: T,
  statusCode: number = HttpStatus.OK,
) {
  return res.status(statusCode).json(data);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = HttpStatus.BAD_REQUEST,
) {
  return res.status(statusCode).json({ message });
}
