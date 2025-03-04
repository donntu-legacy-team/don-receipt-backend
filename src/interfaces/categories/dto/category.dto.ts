import { ApiProperty } from '@nestjs/swagger';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';
import { Category } from '@/domain/categories/category.entity';

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
  })
  subcategories: SubcategoryDto[];

  constructor(category?: Category) {
    if (!category) {
      return;
    }
    this.id = category.id;
    this.name = category.name;
  }
}
