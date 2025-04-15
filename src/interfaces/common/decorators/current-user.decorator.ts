import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/domain/users/user.entity';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User | null }>();
    return request.user;
  },
);
