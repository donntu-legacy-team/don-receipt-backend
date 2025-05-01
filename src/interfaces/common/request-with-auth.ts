import { Request } from 'express';
import { UserRole } from '@/domain/users/user.entity';

export interface AuthRequest extends Request {
  user?: { role: UserRole };
}
