import { ApiProperty } from '@nestjs/swagger';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';

export class FullSubcategoryDto {
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

  @ApiProperty({
    description: 'Айди родительской категории',
    example: '1',
  })
  categoryId: number;

  constructor(subcategory?: Subcategory) {
    if (!subcategory) {
      return;
    }

    this.id = subcategory.id;
    this.name = subcategory.name;
    this.categoryId = subcategory.parentCategory.id;
  }
}
