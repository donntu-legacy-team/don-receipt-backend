import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/domain/users/user.entity';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: User }>();
    return request.user ?? null;
  },
);
