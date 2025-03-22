import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersService } from '@/application/users/users.service';
import { UserDto } from '@/interfaces/users/dto/user.dto';
import { CreateUserDto } from '@/interfaces/users/dto/create-user.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { successResponse, errorResponse } from '@/interfaces/common/response';
import {
  USER_NOT_FOUND_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} from '@/interfaces/users/users-response-messages-constants';

@Controller('users')
export class UsersController {
  constructor(@Inject() private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Найти пользователя по id' })
  @ApiExtraModels(UserDto)
  @ApiNotFoundResponse({
    description: USER_NOT_FOUND_MESSAGE,
    type: ErrorDto,
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  async getUserById(@Res() res: Response, @Query('id') id: number) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      return errorResponse(res, USER_NOT_FOUND_MESSAGE);
    }
    return successResponse(res, { user: new UserDto(user) });
  }

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiExtraModels(UserDto)
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
  async createUser(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    if (!user) {
      return errorResponse(res, USER_ALREADY_EXISTS_MESSAGE);
    }
    return successResponse(res, { user: new UserDto(user) });
  }
}