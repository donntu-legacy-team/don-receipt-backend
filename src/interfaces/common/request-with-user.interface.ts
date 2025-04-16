import { Request } from 'express';
import { User } from '@/domain/users/user.entity';

export interface RequestWithUser extends Request {
  user?: User;
}
