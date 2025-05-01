import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/interfaces/guards/jwt-auth.guard';
import { RolesGuard } from '@/interfaces/guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '@/domain/users/user.entity';

export function Authorized(...roles: UserRole[]) {
  const decorators = roles.length
    ? [Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard)]
    : [UseGuards(JwtAuthGuard)];

  return applyDecorators(ApiBearerAuth('access-token'), ...decorators);
}
