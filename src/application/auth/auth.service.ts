import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '@/application/users/users.service';
import { config } from '@/infrastructure/config/configuration';
import { User } from '@/domain/users/user.entity';
import { TokenPayload } from '@/application/auth/auth.types';
import { CreateUserDto } from '@/interfaces/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return isMatch ? user : null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) {
      return { user };
    }

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    let payload: TokenPayload;
    try {
      payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: config().security.jwtRefreshSecret,
      });
    } catch {
      return { user: null };
    }

    const user = await this.usersService.findUserByUsername(payload.username);
    if (!user) {
      return { user };
    }

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  private generateTokens(user: User) {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: config().security.jwtAccessSecret,
      expiresIn: config().security.jwtAccessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: config().security.jwtRefreshSecret,
      expiresIn: config().security.jwtRefreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }
}
