import { ApiProperty } from '@nestjs/swagger';

export class SubcategoryDto {
  @ApiProperty({
    description: 'ID подкатегории',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Название подкатегории',
    example: 'Холодные салаты',
  })
  name: string;
}
