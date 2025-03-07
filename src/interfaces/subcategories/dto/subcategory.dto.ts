import { ApiProperty } from '@nestjs/swagger';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';

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

  public constructor(subcategory?: Subcategory) {
    if (!subcategory) {
      return;
    }
    this.id = subcategory.id;
    this.name = subcategory.name;
  }

  public withId(id: number) {
    this.id = id;
    return this;
  }

  public withName(name: string) {
    this.name = name;
    return this;
  }
}
