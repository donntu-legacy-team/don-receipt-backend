import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_WEIGHTS, User, UserRole } from '@/domain/users/user.entity';
import { ROLES_KEY } from '@/interfaces/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user: User = request.user;

    if (!user) {
      return false;
    }

    // проверяем, что вес роли у пользователя больше или соответствует весу какой-либо необходимой роли
    // таким образом, если была запрошена роль пользователя, у пользователя роль админа, он все-равно будет иметь доступ к этой ручке
    return requiredRoles.some(
      (role) => ROLES_WEIGHTS[role] <= ROLES_WEIGHTS[user.role],
    );
  }
}
