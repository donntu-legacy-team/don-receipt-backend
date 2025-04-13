import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@/infrastructure/config/configuration';
import { UsersService } from '@/application/users/users.service';
import { User } from '@/domain/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().security.jwtAccessSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findUserByUsername(payload.username);
    return user || null;
  }
}
