import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@/domain/users/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // т.к глобально используем этот гвард, то пропускаем в этом гварде все запросы, ради того, чтобы в контексте запроса был user
  canActivate(context: ExecutionContext) {
    super.canActivate(context);
    return true;
  }

  // @ts-expect-error блядский nest
  handleRequest(err: any, user: User | null) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid access token');
    }

    return user;
  }
}
