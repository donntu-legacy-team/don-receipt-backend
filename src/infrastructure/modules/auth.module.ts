import { Module } from '@nestjs/common';
import { AuthService } from '@/application/auth/auth.service';
import { AuthController } from '@/interfaces/auth/auth.controller';
import { UsersModule } from '@/infrastructure/modules/users.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/infrastructure/config/configuration';
import { JwtStrategy } from '@/interfaces/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/interfaces/guards/jwt-auth.guard';
import { RolesGuard } from '@/interfaces/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: config().security.jwtAccessSecret,
      signOptions: {
        expiresIn: config().security.jwtAccessExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
