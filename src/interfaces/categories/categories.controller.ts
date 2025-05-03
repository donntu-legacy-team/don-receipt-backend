import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Post, Put, Res } from '@nestjs/common';
import { CategoriesService } from '@/application/categories/categories.service';
import { Response } from 'express';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { CategoryDto } from '@/interfaces/categories/dto/category.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';
import { Authorized, Public } from '@/interfaces/common/decorators';
import { CreateCategoryDto } from '@/interfaces/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/interfaces/categories/dto/update-category.dto';
import {
  CATEGORY_ALREADY_EXISTS_MESSAGE,
  CATEGORY_DOES_NOT_EXIST_MESSAGE,
  CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
} from '@/interfaces/constants/category-response-messages.constants';
import { UserRole } from '@/domain/users/user.entity';
import {
  INVALID_ACCESS_TOKEN_MESSAGE,
  NOT_ENOUGH_PRIVILEGES_MESSAGE,
} from '@/interfaces/constants/auth-response-messages.constants';

@Controller('categories')
@ApiBearerAuth('access-token')
export class CategoriesController {
  constructor(@Inject() private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiExtraModels(CategoryDto)
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

  @Authorized(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: '(Администратор) Создать категорию' })
  @ApiExtraModels(CategoryDto)
  @ApiUnauthorizedResponse({
    description: INVALID_ACCESS_TOKEN_MESSAGE,
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: NOT_ENOUGH_PRIVILEGES_MESSAGE,
    type: ErrorDto,
  })
  @ApiOkResponse({
    description: 'Категория успешно создана',
    type: CategoryDto,
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
    return successResponse(res, new CategoryDto(category));
  }

  @Authorized(UserRole.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: '(Администратор) Обновить категорию' })
  @ApiExtraModels(CategoryDto)
  @ApiOkResponse({
    description: CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
    type: CategoryDto,
  })
  @ApiUnauthorizedResponse({
    description: INVALID_ACCESS_TOKEN_MESSAGE,
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: NOT_ENOUGH_PRIVILEGES_MESSAGE,
    type: ErrorDto,
  })
  @ApiNotFoundResponse({
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
    return successResponse(res, new CategoryDto(category));
  }
}
