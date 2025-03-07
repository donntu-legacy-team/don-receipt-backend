import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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
  @ApiOperation({
    summary: 'Получить все категории',
    description: 'Получить все категории с подкатегориями',
  })
  async getCategories(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();

    if (!categories.length) {
      return res.status(404).json({
        message: 'Categories not found',
      });
    }

    const categoriesDto = categories.map((category) => {
      const categoryDto = new CategoryDto()
        .withId(category.id)
        .withName(category.name);
      categoryDto.subcategories = category.subcategories.map((subcategory) => {
        const subcategoryDto = new SubcategoryDto()
          .withId(subcategory.id)
          .withName(subcategory.name);
        return subcategoryDto;
      });

      return categoryDto;
    });

    return res.status(200).json({
      categories: categoriesDto,
    });
  }
}
