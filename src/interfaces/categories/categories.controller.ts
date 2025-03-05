import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Controller, Get, Inject, Res } from '@nestjs/common';
import { CategoriesService } from '@/application/categories/categories.service';
import { Response } from 'express';
import { CategoryDto } from '@/interfaces/categories/dto/category.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject() private categoriesService: CategoriesService) {}

  @Get()
  @ApiExtraModels(CategoryDto)
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    type: ErrorDto,
  })
  @ApiOkResponse({
    schema: {
      properties: {
        categories: { $ref: getSchemaPath(CategoryDto) },
      },
    },
  })
  async getCategories(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();

    if (!categories.length) {
      return res.status(404).json({
        message: 'Categories not found',
      });
    }

    const categoriesDto = new Array<CategoryDto>();

    categories.forEach((category) => {
      const categoryDto = new CategoryDto();
      categoryDto.id = category.id;
      categoryDto.name = category.name;
      categoryDto.subcategories = new Array<SubcategoryDto>();
      category.subcategories.forEach((subcategory) => {
        const subcategoryDto = new SubcategoryDto();
        subcategoryDto.id = subcategory.id;
        subcategoryDto.name = subcategory.name;
        categoryDto.subcategories.push(subcategoryDto);
      });
      categoriesDto.push(categoryDto);
    });

    return res.status(200).json({
      categories: categoriesDto,
    });
  }
}
