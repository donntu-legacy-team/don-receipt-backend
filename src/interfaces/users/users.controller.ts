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
import { UserIdentifierParamDto } from '@/interfaces/users/dto/user-identifier-param.dto';
import { UserShortDto } from '@/interfaces/users/dto/user-short.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { Authorized, Public } from '@/interfaces/common/decorators';
import { User } from '@/domain/users/user.entity';
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

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Получить пользователя по id или username' })
  @ApiExtraModels(UserShortDto, ErrorDto)
  @ApiOkResponse({
    description: 'Данные пользователя',
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserShortDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: USER_NOT_FOUND_MESSAGE,
    type: ErrorDto,
  })
  async getUserById(
    @Res() res: Response,
    @Param() params: UserIdentifierParamDto,
  ) {
    const user = await this.usersService.findUserByIdentifier(params.id);
    if (!user) {
      return errorResponse(res, USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }
    return successResponse(res, { user: new UserShortDto(user) });
  }
}
