import { Response } from 'express';

export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json(data);
};
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 404,
) => {
  return res.status(statusCode).json({ message });
};
