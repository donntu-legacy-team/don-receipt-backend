import { Controller, Get, Param, Res, Req, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from '@/application/users/users.service';
import { UserDto } from '@/interfaces/users/dto/user.dto';
import { UserIdParamDto } from '@/interfaces/users/dto/user-id-param.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { Authorized } from '@/interfaces/common/decorators';
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
  getCurrentUser(@Res() res: Response, @Req() req: Request) {
    const user = req.user as User | undefined;
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
  @ApiOperation({ summary: '(Администратор) Получить пользователя по id' })
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
  async getUserById(@Res() res: Response, @Param() params: UserIdParamDto) {
    const user = await this.usersService.findUserById(params.id);
    if (!user) {
      return errorResponse(res, USER_NOT_FOUND_MESSAGE);
    }
    return successResponse(res, { user: new UserDto(user) });
  }
}
