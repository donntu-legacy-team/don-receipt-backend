import { Controller, Get, Inject, Res } from '@nestjs/common';
import { CategoriesService } from '@/application/categories/categories.service';
import { Response } from 'express';
import { CategoryDto } from '@/interfaces/categories/dto/category.dto';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorDto } from '@/interfaces/common/error-dto';

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

    // TODO(audworth): добавить подкатегории в ответ
    categories.forEach((category) => {
      const categoryDto = new CategoryDto();
      categoryDto.id = category.id;
      categoryDto.name = category.name;
    });

    return res.status(200).json({
      categories: categoriesDto,
    });
  }
}
