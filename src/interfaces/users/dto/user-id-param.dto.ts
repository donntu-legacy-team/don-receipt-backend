// TODO: Должно быть удалено со временем, вместе с эндпоинтом @Get(':id')

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserIdParamDto {
  @ApiProperty({ description: 'ID пользователя', example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;
}
