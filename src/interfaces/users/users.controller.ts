import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  BadRequestException,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '@/application/users/users.service';
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
    description: 'User not found',
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
  async getUsers(@Query('id') id: number): Promise<{ user: UserDto }> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.username = user.username;
    userDto.email = user.email;
    return { user: userDto };
  }

  @Post()
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
    description: 'User with this username or email already exists',
    type: ErrorDto,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: UserDto }> {
    const user = await this.usersService.createUser(createUserDto);
    if (!user) {
      throw new BadRequestException(
        'User with this username or email already exists',
      );
    }

    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.username = user.username;
    userDto.email = user.email;
    return { user: userDto };
  }
}