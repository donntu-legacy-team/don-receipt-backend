import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReceiptsQueryDto {
  @ApiPropertyOptional({
    description: 'Текст для поиска по заголовку и содержимому рецепта',
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({
    description: 'ID автора рецептов',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  authorId?: number;

  @ApiPropertyOptional({
    description: 'ID категории рецептов',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'ID подкатегории рецептов (имеет приоритет над categoryId)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subcategoryId?: number;
}
