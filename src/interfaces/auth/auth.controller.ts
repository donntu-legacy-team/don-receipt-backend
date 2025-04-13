import {
  Controller,
  Post,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';

import { AuthService } from '@/application/auth/auth.service';
import { LoginDto } from '@/interfaces/auth/dto/login.dto';
import { RefreshTokenDto } from '@/interfaces/auth/dto/refresh-token.dto';
import { CreateUserDto } from '@/interfaces/users/dto/create-user.dto'; // важно импортировать DTO для создания пользователя
import { UserDto } from '@/interfaces/users/dto/user.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { Authorized, CurrentUser } from '@/interfaces/common/decorators';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { User } from '@/domain/users/user.entity';
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} from '@/interfaces/auth/auth-response-messages.constants';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя и получение токенов' })
  @ApiOkResponse({ description: 'Возвращает accessToken и refreshToken' })
  @ApiUnauthorizedResponse({ description: 'Неверные учетные данные' })
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const loginData = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    if (!loginData.user) {
      return errorResponse(res, AUTH_INVALID_CREDENTIALS_MESSAGE, 401);
    }

    return successResponse(res, {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiOkResponse({ description: 'Возвращает новые accessToken и refreshToken' })
  @ApiBadRequestResponse({ description: 'Неверный refresh токен' })
  async refresh(
    @Res() res: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const refreshData = await this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
    );

    if (!refreshData.user) {
      return errorResponse(res, AUTH_INVALID_CREDENTIALS_MESSAGE, 401);
    }

    return successResponse(res, {
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
    });
  }

  @Get('user')
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiOkResponse({
    description: 'Возвращает данные пользователя',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'Неверный access токен' })
  @Authorized()
  getCurrentUser(@Res() res: Response, @CurrentUser() user: User) {
    if (!user) {
      return errorResponse(res, AUTH_INVALID_CREDENTIALS_MESSAGE);
    }

    return successResponse(res, { user: new UserDto(user) });
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiOkResponse({
    description: 'User created successfully',
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: USER_ALREADY_EXISTS_MESSAGE,
    type: ErrorDto,
  })
  async register(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    if (!user) {
      return errorResponse(res, USER_ALREADY_EXISTS_MESSAGE);
    }
    return successResponse(res, { user: new UserDto(user) });
  }
}