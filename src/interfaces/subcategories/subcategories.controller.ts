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
import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  Put,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SubcategoriesService } from '@/application/subcategories/subcategories.service';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';
import { FullSubcategoryDto } from '@/interfaces/subcategories/dto/full-subcategory.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { Response } from 'express';
import { CreateSubcategoryDto } from '@/interfaces/subcategories/dto/create-subcategory.dto';
import {
  errorResponse,
  successResponse,
  successResponseMessage,
} from '@/interfaces/common/helpers/response.helper';
import {
  CATEGORY_DOES_NOT_EXIST_MESSAGE,
  CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
} from '@/interfaces/constants/category-response-messages.constants';
import {
  SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
  SUBCATEGORY_DOES_NOT_EXIST_MESSAGE,
  SUBCATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
} from '@/interfaces/constants/subcategory-response-messages.constants';
import { SuccessDto } from '@/interfaces/common/success-dto';
import { UpdateSubcategoryDto } from '@/interfaces/subcategories/dto/update-subcategory.dto';
import { Authorized } from '@/interfaces/common/decorators';
import { UserRole } from '@/domain/users/user.entity';
import {
  INVALID_ACCESS_TOKEN_MESSAGE,
  NOT_ENOUGH_PRIVILEGES_MESSAGE,
} from '@/interfaces/constants/auth-response-messages.constants';

@Controller('subcategories')
@ApiBearerAuth('access-token')
export class SubcategoriesController {
  constructor(@Inject() private subcategoriesService: SubcategoriesService) {}

  @Authorized(UserRole.ADMIN)
  @Post(':id')
  @ApiOperation({
    summary: '(Администратор) Создать подкатегорию для категории',
  })
  @ApiExtraModels(FullSubcategoryDto)
  @ApiOkResponse({
    description: 'Подкатегория успешно создана',
    schema: {
      properties: {
        subcategory: { $ref: getSchemaPath(FullSubcategoryDto) },
      },
    },
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
  @ApiBadRequestResponse({
    description: SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
    type: ErrorDto,
  })
  async createSubcategory(
    @Res() res: Response,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    try {
      const subcategory =
        await this.subcategoriesService.createSubcategory(createSubcategoryDto);

      return successResponse(res, {
        subcategory: new FullSubcategoryDto(subcategory),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return errorResponse(res, error.message);
      } else if (error instanceof ConflictException) {
        return errorResponse(res, error.message);
      }
    }
  }

  @Authorized(UserRole.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: '(Администратор) Обновить подкатегорию категории' })
  @ApiExtraModels(SubcategoryDto)
  @ApiOkResponse({
    description: CATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
    type: SuccessDto,
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
    return successResponseMessage(
      res,
      SUBCATEGORY_SUCCESSFULLY_UPDATED_MESSAGE,
    );
  }
}
