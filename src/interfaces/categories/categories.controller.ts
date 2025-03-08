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
import { successResponse, errorResponse } from '@/interfaces/common/response';
import { CategoryDto } from '@/interfaces/categories/dto/category.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';

const CATEGORIES_NOT_FOUND = 'Categories Not Found';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject() private categoriesService: CategoriesService) {}

  @Get()
  @ApiExtraModels(CategoryDto)
  @ApiNotFoundResponse({
    description: CATEGORIES_NOT_FOUND,
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
    summary: 'Получить все категории c их подкатегориями',
  })
  async getCategories(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();

    if (!categories.length) {
      return errorResponse(res, CATEGORIES_NOT_FOUND);
    }

    const categoriesDto = categories.map((category) => {
      const categoryDto = new CategoryDto(category);
      categoryDto.subcategories = category.subcategories.map((subcategory) => {
        const subcategoryDto = new SubcategoryDto(subcategory);
        return subcategoryDto;
      });

      return categoryDto;
    });

    return successResponse(res, { categories: categoriesDto });
  }
}
