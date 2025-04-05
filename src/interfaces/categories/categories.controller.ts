import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Post, Put, Res } from '@nestjs/common';
import { CategoriesService } from '@/application/categories/categories.service';
import { Response } from 'express';
import { successResponse, errorResponse } from '@/interfaces/common/helpers/response.helper';
import { CategoryDto } from '@/interfaces/categories/dto/category.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { SuccessDto } from '@/interfaces/common/success-dto';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';
import { Public } from '@/interfaces/common/decorators';
import { CreateCategoryDto } from '@/interfaces/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/interfaces/categories/dto/update-category.dto';
import {
  CATEGORIES_NOT_FOUND_MESSAGE,
  CATEGORY_ALREADY_EXISTS_MESSAGE,
  CATEGORY_DOES_NOT_EXIST_MESSAGE,
  CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
} from '@/interfaces/constants/category.constants';

@Controller('categories')
export class CategoriesController {
  constructor(@Inject() private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiExtraModels(CategoryDto)
  @ApiNotFoundResponse({
    description: CATEGORIES_NOT_FOUND_MESSAGE,
    type: ErrorDto,
  })
  @ApiOkResponse({
    schema: {
      properties: {
        categories: {
          type: 'array',
          items: { $ref: getSchemaPath(CategoryDto) },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Получить все категории c их подкатегориями',
  })
  async getCategories(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();

    if (!categories.length) {
      return errorResponse(res, CATEGORIES_NOT_FOUND_MESSAGE);
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

  @Post()
  @ApiOperation({ summary: 'Создать категорию' })
  @ApiExtraModels(CategoryDto)
  @ApiOkResponse({
    description: 'Category created successfully',
    schema: {
      properties: {
        category: { $ref: getSchemaPath(CategoryDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: CATEGORY_ALREADY_EXISTS_MESSAGE,
    type: ErrorDto,
  })
  async createCategory(
    @Res() res: Response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);
    if (!category) {
      return errorResponse(res, CATEGORY_ALREADY_EXISTS_MESSAGE);
    }
    return successResponse(res, { category: new CategoryDto(category) });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiExtraModels(CategoryDto)
  @ApiOkResponse({
    description: CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
    type: SuccessDto,
  })
  @ApiBadRequestResponse({
    description: CATEGORY_DOES_NOT_EXIST_MESSAGE,
    type: ErrorDto,
  })
  async updateCategory(
    @Res() res: Response,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category =
      await this.categoriesService.updateCategory(updateCategoryDto);
    if (!category) {
      return errorResponse(res, CATEGORY_DOES_NOT_EXIST_MESSAGE);
    }
    return successResponse(res, CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE);
  }
}
