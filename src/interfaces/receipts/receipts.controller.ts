import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Req,
  Res,
  ParseIntPipe,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiBody,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ReceiptService } from '@/application/receipts/receipts.service';
import { CreateReceiptDraftDto } from './dto/create-receipt-draft.dto';
import { UpdateReceiptDraftDto } from './dto/update-receipt-draft.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { Authorized } from '@/interfaces/common/decorators/authorized.decorator';
import { Public } from '@/interfaces/common/decorators/public.decorator';
import { User } from '@/domain/users/user.entity';
import {
  successResponse,
  errorResponse,
} from '../common/helpers/response.helper';
import { GetReceiptsQueryDto } from './dto/get-receipts-query.dto';

@ApiTags('receipts')
@ApiBearerAuth('access-token')
@ApiExtraModels(ReceiptDto, ErrorDto)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('drafts')
  @Authorized()
  @ApiOperation({ summary: 'Создать новый черновик рецепта' })
  @ApiBody({
    type: CreateReceiptDraftDto,
    description:
      'Данные для нового черновика. Необходимо указать subcategoryId',
    examples: {
      default: {
        summary: 'Пример создания черновика',
        value: {
          title: 'Борщ',
          receiptContent:
            'Нарезать овощи, сварить бульон и собрать всё вместе…',
          subcategoryId: 2,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Черновик успешно создан',
    schema: {
      properties: {
        receipt: { $ref: getSchemaPath(ReceiptDto) },
      },
    },
  })
  async createDraft(
    @Res() res: Response,
    @Body() createDraftDto: CreateReceiptDraftDto,
    @Req() req: Request & { user: User }, // TODO: нужен декоратор CurrentUser
  ) {
    try {
      const receipt = await this.receiptService.createDraft(
        createDraftDto,
        req.user,
      );
      return successResponse(res, { receipt: new ReceiptDto(receipt) });
    } catch {
      return errorResponse(
        // TODO: переписать на совесть
        res,
        'Ошибка при создании черновика',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('drafts/:id')
  @Authorized()
  @ApiOperation({ summary: 'Обновить существующий черновик рецепта' })
  @ApiBody({
    type: UpdateReceiptDraftDto,
    description: 'Поля для обновления черновика',
    examples: {
      default: {
        summary: 'Пример обновления черновика',
        value: {
          title: 'Борщ с говядиной',
          receiptContent: 'Добавить мясо в бульон, затем овощи…',
          subcategoryId: 2,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Черновик успешно обновлен',
    schema: {
      properties: {
        receipt: { $ref: getSchemaPath(ReceiptDto) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Черновик не найден', type: ErrorDto })
  @ApiForbiddenResponse({ description: 'Доступ запрещён', type: ErrorDto })
  @ApiBadRequestResponse({
    description: 'Можно редактировать только черновики',
    type: ErrorDto,
  })
  async updateDraft(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDraftDto: UpdateReceiptDraftDto,
    @Req() req: Request & { user: User },
  ) {
    try {
      const receipt = await this.receiptService.updateDraft(
        id,
        req.user,
        updateDraftDto,
      );
      if (!receipt) {
        throw new NotFoundException('Рецепт не найден');
      }
      return successResponse(res, { receipt: new ReceiptDto(receipt) });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return errorResponse(res, 'Не найдено', HttpStatus.NOT_FOUND);
      } else if (error instanceof ForbiddenException) {
        return errorResponse(res, 'Доступ запрещён', HttpStatus.FORBIDDEN);
      } else if (error instanceof BadRequestException) {
        return errorResponse(
          res,
          'Некорректный запрос',
          HttpStatus.BAD_REQUEST,
        );
      }
      return errorResponse(
        res,
        'Внутренняя ошибка сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('drafts')
  @Authorized()
  @ApiOperation({ summary: 'Получить все черновики текущего пользователя' })
  @ApiOkResponse({
    description: 'Список черновиков пользователя',
    schema: {
      properties: {
        receipts: {
          type: 'array',
          items: { $ref: getSchemaPath(ReceiptDto) },
        },
      },
    },
  })
  async getDrafts(@Res() res: Response, @Req() req: Request & { user: User }) {
    try {
      const receipts = await this.receiptService.getUserDrafts(req.user);
      return successResponse(res, {
        receipts: receipts.map((receipt) => new ReceiptDto(receipt)),
      });
    } catch {
      return errorResponse(
        res,
        'Ошибка при получении черновиков',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('publish/:id')
  @Authorized()
  @ApiOperation({ summary: 'Опубликовать черновик рецепта' })
  @ApiOkResponse({
    description: 'Черновик успешно опубликован',
    schema: {
      properties: {
        receipt: { $ref: getSchemaPath(ReceiptDto) },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Черновик не найден', type: ErrorDto })
  @ApiForbiddenResponse({ description: 'Доступ запрещён', type: ErrorDto })
  @ApiBadRequestResponse({
    description:
      'Нельзя публиковать не-черновики или черновики без подкатегории',
    type: ErrorDto,
  })
  async publishDraft(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    try {
      const receipt = await this.receiptService.getDraftById(id, req.user);
      if (!receipt) {
        throw new NotFoundException('Черновик не найден');
      }
      if (
        !receipt.title ||
        receipt.title.trim() === '' ||
        !receipt.receiptContent ||
        receipt.receiptContent.trim() === ''
      ) {
        return errorResponse(
          res,
          'Нельзя опубликовать рецепт с пустым названием или содержимым',
          HttpStatus.BAD_REQUEST,
        );
      }
      const publishedReceipt = await this.receiptService.publishDraft(
        id,
        req.user,
      );
      return successResponse(res, {
        receipt: new ReceiptDto(publishedReceipt),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return errorResponse(res, 'Не найдено', HttpStatus.NOT_FOUND);
      } else if (error instanceof ForbiddenException) {
        return errorResponse(res, 'Доступ запрещён', HttpStatus.FORBIDDEN);
      } else if (error instanceof BadRequestException) {
        return errorResponse(
          res,
          'Некорректный запрос',
          HttpStatus.BAD_REQUEST,
        );
      }
      return errorResponse(
        res,
        'Внутренняя ошибка сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('')
  @ApiOperation({ summary: 'Получить все опубликованные рецепты' })
  @ApiOkResponse({
    description: 'Список опубликованных рецептов',
    schema: {
      properties: {
        receipts: {
          type: 'array',
          items: { $ref: getSchemaPath(ReceiptDto) },
        },
      },
    },
  })
  async getAllPublished(
    @Res() res: Response,
    @Query() query: GetReceiptsQueryDto,
  ) {
    try {
      const receipts = await this.receiptService.getAllPublished(query);
      return successResponse(res, {
        receipts: receipts.map((receipt) => new ReceiptDto(receipt)),
      });
    } catch {
      return errorResponse(
        res,
        'Ошибка при получении опубликованных рецептов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить опубликованный рецепт по id' })
  @ApiOkResponse({
    description: 'Опубликованный рецепт',
    schema: {
      properties: { receipt: { $ref: getSchemaPath(ReceiptDto) } },
    },
  })
  @ApiNotFoundResponse({ description: 'Рецепт не найден', type: ErrorDto })
  async getPublishedById(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const receipt = await this.receiptService.getPublishedById(id);
      if (!receipt) {
        throw new NotFoundException('Рецепт не найден');
      }
      return successResponse(res, { receipt: new ReceiptDto(receipt) });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return errorResponse(res, 'Не найдено', HttpStatus.NOT_FOUND);
      } else if (error instanceof ForbiddenException) {
        return errorResponse(res, 'Доступ запрещён', HttpStatus.FORBIDDEN);
      } else if (error instanceof BadRequestException) {
        return errorResponse(
          res,
          'Некорректный запрос',
          HttpStatus.BAD_REQUEST,
        );
      }
      return errorResponse(
        res,
        'Внутренняя ошибка сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Authorized()
  @Get('drafts/:id')
  @ApiOperation({
    summary: 'Получить черновик рецепта по id (только для автора)',
  })
  @ApiOkResponse({
    description: 'Черновик рецепта',
    schema: {
      properties: { receipt: { $ref: getSchemaPath(ReceiptDto) } },
    },
  })
  @ApiNotFoundResponse({ description: 'Черновик не найден', type: ErrorDto })
  async getDraftById(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    try {
      const receipt = await this.receiptService.getDraftById(id, req.user);
      if (!receipt) {
        throw new NotFoundException('Черновик не найден');
      }
      return successResponse(res, { receipt: new ReceiptDto(receipt) });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return errorResponse(res, 'Не найдено', HttpStatus.NOT_FOUND);
      } else if (error instanceof ForbiddenException) {
        return errorResponse(res, 'Доступ запрещён', HttpStatus.FORBIDDEN);
      } else if (error instanceof BadRequestException) {
        return errorResponse(
          res,
          'Некорректный запрос',
          HttpStatus.BAD_REQUEST,
        );
      }
      return errorResponse(
        res,
        'Внутренняя ошибка сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
