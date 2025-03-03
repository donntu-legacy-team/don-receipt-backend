import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from '@/application/users/users.service';
import { Response } from 'express';
import { UserDto } from '@/interfaces/users/dto/user.dto';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateUserDto } from '@/interfaces/users/dto/create-user.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';

@Controller('users')
export class UsersController {
  constructor(@Inject() private usersService: UsersService) {}

  @Get()
  @ApiExtraModels(UserDto)
  @ApiNotFoundResponse({
    description: 'User Not Found',
    type: ErrorDto,
  })
  @ApiOkResponse({
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  async getUsers(@Query('id') id: number, @Res() res: Response) {
    const user = await this.usersService.findUserById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.username = user.username;
    return res.status(200).json({
      user: userDto,
    });
  }

  @Post()
  @ApiExtraModels(UserDto)
  @ApiOkResponse({
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    type: ErrorDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.createUser(createUserDto);

    if (!user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.username = user.username;
    return res.status(200).json({
      user: userDto,
    });
  }
}
