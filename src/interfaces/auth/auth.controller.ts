import { Controller, Post, Body, Res, Get, HttpStatus } from '@nestjs/common';
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
import { CreateUserDto } from '@/interfaces/users/dto/create-user.dto';
import { UserDto } from '@/interfaces/users/dto/user.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { TokensPairDto } from '@/interfaces/auth/dto/tokens-pair.dto';
import { Authorized, CurrentUser } from '@/interfaces/common/decorators';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { User } from '@/domain/users/user.entity';
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} from '@/interfaces/constants/auth-response-messages.constants';

@ApiTags('Авторизация')
@Controller('auth')
@ApiExtraModels(UserDto, TokensPairDto, ErrorDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя и получение токенов' })
  @ApiOkResponse({
    description: 'Возвращает accessToken и refreshToken',
    type: TokensPairDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные учетные данные',
    type: ErrorDto,
  })
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const loginData = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    if (!loginData.user) {
      return errorResponse(
        res,
        AUTH_INVALID_CREDENTIALS_MESSAGE,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokensPair: TokensPairDto = {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    };

    return successResponse(res, tokensPair);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  @ApiOkResponse({
    description: 'Возвращает новые accessToken и refreshToken',
    type: TokensPairDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверный refresh токен',
    type: ErrorDto,
  })
  async refresh(
    @Res() res: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const refreshData = await this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
    );

    if (!refreshData.user) {
      return errorResponse(
        res,
        AUTH_INVALID_CREDENTIALS_MESSAGE,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokensPair: TokensPairDto = {
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
    };

    return successResponse(res, tokensPair);
  }

  @Get('user')
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiOkResponse({
    description: 'Возвращает данные пользователя',
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Неверный access токен',
    type: ErrorDto,
  })
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
