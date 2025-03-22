import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { AuthService } from '@/application/auth/auth.service';
import { successResponse, errorResponse } from '@/interfaces/common/response';
import { LoginDto } from '@/interfaces/auth/dto/login.dto';
import { RefreshTokenDto } from '@/interfaces/auth/dto/refresh-token.dto';
import { JwtAuthGuard } from '@/infrastructure/guards/jwt-auth.guard';
import { UserDto } from '@/interfaces/users/dto/user.dto';
import { User } from '@/domain/users/user.entity';
import { CurrentUser } from '@/interfaces/auth/decorators/current-user.decorator';
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  AUTH_INVALID_REFRESH_TOKEN_MESSAGE,
  AUTH_USER_NOT_FOUND_MESSAGE,
} from '@/interfaces/auth/auth-response-messages-constants';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя и получение токенов' })
  @ApiOkResponse({ description: 'Возвращает accessToken и refreshToken' })
  @ApiBadRequestResponse({ description: 'Неверные учетные данные' })
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        loginDto.username,
        loginDto.password,
      );
      return successResponse(res, { accessToken, refreshToken });
    } catch (error) {
      return errorResponse(res, AUTH_INVALID_CREDENTIALS_MESSAGE);
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiOkResponse({ description: 'Возвращает новые accessToken и refreshToken' })
  @ApiBadRequestResponse({ description: 'Неверный refresh токен' })
  async refresh(@Res() res: Response, @Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.refreshTokens(
        refreshTokenDto.refreshToken,
      );
      return successResponse(res, { accessToken, refreshToken });
    } catch (error) {
      return errorResponse(res, AUTH_INVALID_REFRESH_TOKEN_MESSAGE);
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiOkResponse({ description: 'Возвращает данные пользователя', type: UserDto })
  @ApiBadRequestResponse({ description: 'Неверный access токен' })
  async getCurrentUser(@Res() res: Response, @CurrentUser() user: User) {
    if (!user) {
      return errorResponse(res, AUTH_USER_NOT_FOUND_MESSAGE);
    }
    return successResponse(res, { user: new UserDto(user) });
  }
}
