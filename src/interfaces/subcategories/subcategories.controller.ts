import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { Body, Controller, Inject, Post, Res, Put } from '@nestjs/common';
import { SubcategoriesService } from '@/application/subcategories/subcategories.service';
import { CategoriesService } from '@/application/categories/categories.service';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { Response } from 'express';
import { CreateSubcategoryDto } from '@/interfaces/subcategories/dto/create-subcategory.dto';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import {
  CATEGORY_DOES_NOT_EXIST_MESSAGE,
  CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
} from '@/interfaces/constants/category.constants';
import {
  SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
  SUBCATEGORY_DOES_NOT_EXIST_MESSAGE,
  SUBCATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
} from '@/interfaces/constants/subcategory.constants';
import { SuccessDto } from '@/interfaces/common/success-dto';
import { UpdateSubcategoryDto } from '@/interfaces/subcategories/dto/update-subcategory.dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(
    @Inject() private subcategoriesService: SubcategoriesService,
    @Inject() private categoriesService: CategoriesService,
  ) {}

  @Post(':id')
  @ApiOperation({ summary: 'Создать подкатегорию для категории' })
  @ApiExtraModels(SubcategoryDto)
  @ApiOkResponse({
    description: 'Subcategory created successfully',
    schema: {
      properties: {
        subcategory: { $ref: getSchemaPath(SubcategoryDto) },
      },
    },
  })
  @ApiBadRequestResponse({
    description: SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
    type: ErrorDto,
  })
  async createSubcategory(
    @Res() res: Response,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    const category = await this.categoriesService.findCategoryById(
      createSubcategoryDto.categoryId,
    );
    if (!category) {
      return errorResponse(res, CATEGORY_DOES_NOT_EXIST_MESSAGE);
    }

    const subcategory = await this.subcategoriesService.createSubcategory({
      name: createSubcategoryDto.name,
      parentCategory: category,
    });
    if (!subcategory) {
      return errorResponse(res, SUBCATEGORY_ALREADY_EXISTS_MESSAGE);
    }

    return successResponse(res, {
      subcategory: new SubcategoryDto(subcategory),
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить подкатегорию категории' })
  @ApiExtraModels(SubcategoryDto)
  @ApiOkResponse({
    description: CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
    type: SuccessDto,
  })
  @ApiBadRequestResponse({
    description: SUBCATEGORY_DOES_NOT_EXIST_MESSAGE,
    type: ErrorDto,
  })
  async updateSubcategory(
    @Res() res: Response,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    const subcategory =
      await this.subcategoriesService.updateSubcategory(updateSubcategoryDto);
    if (!subcategory) {
      return errorResponse(res, SUBCATEGORY_DOES_NOT_EXIST_MESSAGE);
    }
    return successResponse(res, SUBCATEGORY_SUCCESSFULLY_UPDATED_MESSAGE);
  }
}
