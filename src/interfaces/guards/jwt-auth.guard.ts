import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const can = (await super.canActivate(context)) as boolean;
    if (!can) {
      throw new UnauthorizedException('Invalid or missing JWT token');
    }
    return true;
  }
}
