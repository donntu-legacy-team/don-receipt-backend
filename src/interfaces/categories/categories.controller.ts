import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Put,
  Res,
} from '@nestjs/common';
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
  @ApiOkResponse({
    description: 'Категория успешно создана',
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
      return errorResponse(
        res,
        CATEGORY_ALREADY_EXISTS_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
    return successResponse(res, { category: new CategoryDto(category) });
  }

  @Authorized(UserRole.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: '(Администратор) Обновить категорию' })
  @ApiExtraModels(CategoryDto)
  @ApiOkResponse({
    description: CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
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
  @ApiNotFoundResponse({
    description: CATEGORY_DOES_NOT_EXIST_MESSAGE,
    type: ErrorDto,
  })
  async updateCategory(
    @Res() res: Response,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const category =
        await this.categoriesService.updateCategory(updateCategoryDto);

      return successResponse(res, { category: new CategoryDto(category) });
    } catch (error) {
      // TODO: в будущем нужно поменять на нормальный хендлер ошибок
      if (error instanceof NotFoundException) {
        return errorResponse(res, error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof ConflictException) {
        return errorResponse(res, error.message);
      } else {
        return errorResponse(
          res,
          'Внутренняя ошибка сервера',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
