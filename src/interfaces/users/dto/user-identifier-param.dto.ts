import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserIdentifierParamDto {
  @ApiProperty({
    description: 'ID пользователя или имя пользователя',
    example: '25 или username',
  })
  @ValidateIf((o: UserIdentifierParamDto) => isNaN(Number(o.id)))
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  id!: string;
}
