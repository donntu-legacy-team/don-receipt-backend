import { ApiProperty } from '@nestjs/swagger';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';

export class CategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subcategories: SubcategoryDto[];
}
