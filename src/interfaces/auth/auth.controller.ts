import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
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
import { Public } from '@/interfaces/common/decorators';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import {
  AUTH_INVALID_CREDENTIALS_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} from '@/interfaces/constants/auth-response-messages.constants';

@ApiTags('Авторизация')
@Controller('auth')
@ApiExtraModels(UserDto, TokensPairDto, ErrorDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя и получение токенов' })
  @ApiOkResponse({
    description: 'Возвращает accessToken и refreshToken',
    type: TokensPairDto,
  })
  @ApiBadRequestResponse({
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
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokensPair: TokensPairDto = {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    };

    return successResponse(res, tokensPair);
  }

  @Public()
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
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokensPair: TokensPairDto = {
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken,
    };

    return successResponse(res, tokensPair);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiOkResponse({
    description: 'Пользователь зарегистрирован успешно',
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
