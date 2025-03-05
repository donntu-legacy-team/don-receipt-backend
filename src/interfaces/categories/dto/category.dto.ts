import { ApiProperty } from '@nestjs/swagger';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';

export class CategoryDto {
  @ApiProperty({
    description: 'ID категории',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Название категории',
    example: 'Салаты',
  })
  name: string;

  @ApiProperty({
    type: [SubcategoryDto],
    description: 'Массив подкатегорий данной категории',
    example: [
      'id: 1, name: Холодные салаты',
      'id: 2, name: Салаты с морепродуктами',
      'id: 3, name: Мясные салаты',
    ],
  })
  subcategories: SubcategoryDto[];
}
