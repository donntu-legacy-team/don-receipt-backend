import { UserRole } from '@/domain/users/user.entity';

export type TokenPayload = {
  sub: number;
  username: string;
  role: UserRole;
};