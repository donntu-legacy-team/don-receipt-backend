import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@/infrastructure/config/configuration';
import { UsersService } from '@/application/users/users.service';
import { TokenPayload } from '@/application/auth/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().security.jwtAccessSecret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.findUserByUsername(payload.username);
    return user || null;
  }
}
