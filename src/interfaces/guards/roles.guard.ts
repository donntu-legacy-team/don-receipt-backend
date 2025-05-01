import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/interfaces/common/decorators/roles.decorator';
import { UserRole, ROLES_WEIGHTS } from '@/domain/users/user.entity';

import { AuthRequest } from '@/interfaces/common/request-with-auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован.');
    }

    const userWeight = ROLES_WEIGHTS[user.role];

    const pass = requiredRoles.some(
      (role) => userWeight >= ROLES_WEIGHTS[role],
    );

    if (!pass) {
      throw new ForbiddenException('Недостаточно прав');
    }
    return true;
  }
}
