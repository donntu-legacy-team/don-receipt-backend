import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { UsersService } from '@/application/users/users.service';
import { UserDto } from '@/interfaces/users/dto/user.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { Authorized, CurrentUser } from '@/interfaces/common/decorators';
import { User, UserRole } from '@/domain/users/user.entity';
import { AUTH_INVALID_CREDENTIALS_MESSAGE } from '@/interfaces/constants/auth-response-messages.constants';
import { USER_NOT_FOUND_MESSAGE } from '@/interfaces/constants/users-response-messages.constants';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Authorized()
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiExtraModels(UserDto, ErrorDto)
  @ApiOkResponse({
    description: 'Возвращает данные пользователя',
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный access токен',
    type: ErrorDto,
  })
  getCurrentUser(@Res() res: Response, @CurrentUser() user: User | null) {
    if (!user) {
      return errorResponse(
        res,
        AUTH_INVALID_CREDENTIALS_MESSAGE,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return successResponse(res, { user: new UserDto(user) });
  }
  // TODO: убрать, временный эндпоинт для демонстрации работы декоратора
  @Get(':id')
  @Authorized(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получить пользователя по id (admin only)' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'ID пользователя',
  })
  @ApiOkResponse({
    description: 'Данные пользователя',
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: USER_NOT_FOUND_MESSAGE,
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorDto,
  })
  async getUserById(@Res() res: Response, @Param('id') id: number) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      return errorResponse(res, USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }
    return successResponse(res, { user: new UserDto(user) });
  }
}
