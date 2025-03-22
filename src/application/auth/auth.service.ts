import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '@/application/users/users.service';
import { config } from '@/infrastructure/config/configuration';
import { User } from '@/domain/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
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
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: config().security.jwtRefreshSecret,
      });

      const user = await this.usersService.findUserByUsername(payload.username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = this.generateTokens(user);
      return { user, ...tokens };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: User) {
    const payload = {
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
}
