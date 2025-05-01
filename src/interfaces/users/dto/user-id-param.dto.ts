// TODO: Должно быть удалено со временем, вместе с эндпоинтом @Get(':id')

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UserIdParamDto {
  @ApiProperty({
    description: 'ID пользователя',
    type: Number,
    example: 42,
  })
  @IsInt()
  @Min(1)
  id!: number;
}
