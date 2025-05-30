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
  Controller,
  Inject,
  Post,
  Res,
  Put,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SubcategoriesService } from '@/application/subcategories/subcategories.service';
import { FullSubcategoryDto } from '@/interfaces/subcategories/dto/full-subcategory.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { Response } from 'express';
import { CreateSubcategoryDto } from '@/interfaces/subcategories/dto/create-subcategory.dto';
import {
  errorResponse,
  successResponse,
} from '@/interfaces/common/helpers/response.helper';
import { CATEGORY_DOES_NOT_EXIST_MESSAGE } from '@/interfaces/constants/category-response-messages.constants';
import {
  SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
  SUBCATEGORY_DOES_NOT_EXIST_MESSAGE,
} from '@/interfaces/constants/subcategory-response-messages.constants';
import { UpdateSubcategoryDto } from '@/interfaces/subcategories/dto/update-subcategory.dto';
import { Authorized } from '@/interfaces/common/decorators';
import { UserRole } from '@/domain/users/user.entity';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';

@Controller('subcategories')
@ApiBearerAuth('access-token')
export class SubcategoriesController {
  constructor(@Inject() private subcategoriesService: SubcategoriesService) {}

  @Authorized(UserRole.ADMIN)
  @Post()
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
  @ApiBadRequestResponse({
    description: SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
    type: ErrorDto,
  })
  @ApiNotFoundResponse({
    description: CATEGORY_DOES_NOT_EXIST_MESSAGE,
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

  @Authorized(UserRole.ADMIN)
  @Put()
  @ApiOperation({ summary: '(Администратор) Обновить подкатегорию категории' })
  @ApiExtraModels(SubcategoryDto)
  @ApiOkResponse({
    description: 'Подкатегория успешно обновлена',
    schema: {
      properties: {
        subcategory: { $ref: getSchemaPath(FullSubcategoryDto) },
      },
    },
  })
  @ApiNotFoundResponse({
    description: `${CATEGORY_DOES_NOT_EXIST_MESSAGE} / ${SUBCATEGORY_DOES_NOT_EXIST_MESSAGE}`,
    type: ErrorDto,
  })
  async updateSubcategory(
    @Res() res: Response,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    try {
      const subcategory =
        await this.subcategoriesService.updateSubcategory(updateSubcategoryDto);

      return successResponse(res, {
        subcategory: new FullSubcategoryDto(subcategory),
      });
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
