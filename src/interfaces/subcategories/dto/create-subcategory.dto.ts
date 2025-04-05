import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
