import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole, User } from '@/domain/users/user.entity';
import { ROLES_KEY } from '@/interfaces/common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
