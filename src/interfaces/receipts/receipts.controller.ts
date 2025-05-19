import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Req,
  Res,
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
} from '@nestjs/swagger';

import { RecipeService } from '@/application/receipts/receipts.service';
import { CreateRecipeDraftDto } from './dto/create-recipe-draft.dto';
import { UpdateRecipeDraftDto } from './dto/update-recipe-draft.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { ErrorDto } from '@/interfaces/common/error-dto';
import { Authorized } from '@/interfaces/common/decorators/authorized.decorator';
import { Public } from '@/interfaces/common/decorators/public.decorator';
import { User } from '@/domain/users/user.entity';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { successResponse } from '../common/helpers/response.helper';

@ApiTags('Рецепты')
@ApiExtraModels(ReceiptDto, ErrorDto)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptService: RecipeService) {}

  @Post('drafts')
  @Authorized()
  @ApiOperation({ summary: 'Создать новый черновик рецепта' })
  @ApiBody({
    type: CreateRecipeDraftDto,
    description: 'Данные для нового черновика',
    examples: {
      default: {
        summary: 'Пример создания черновика',
        value: {
          title: 'Борщ',
          receiptContent:
            'Нарезать овощи, сварить бульон и собрать всё вместе…',
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
    @Body() createDraftDto: CreateRecipeDraftDto,
    @Req() req: Request & { user: User },
  ) {
    const receipt = await this.receiptService.createDraft(
      req.user,
      createDraftDto,
    );

    return successResponse(res, { receipt: new ReceiptDto(receipt) });
  }

  @Put('drafts/:id')
  @Authorized()
  @ApiOperation({ summary: 'Обновить существующий черновик рецепта' })
  @ApiBody({
    type: UpdateRecipeDraftDto,
    description: 'Поля для обновления черновика',
    examples: {
      default: {
        summary: 'Пример обновления черновика',
        value: {
          title: 'Борщ с говядиной',
          receiptContent: 'Добавить мясо в бульон, затем овощи…',
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
    @Param('id') id: string,
    @Body() updateDraftDto: UpdateRecipeDraftDto,
    @Req() req: Request & { user: User },
  ): Promise<Receipt> {
    return this.receiptService.updateDraft(+id, req.user, updateDraftDto);
  }

  @Get('drafts')
  @Authorized()
  @ApiOperation({ summary: 'Получить все черновики текущего пользователя' })
  @ApiOkResponse({
    description: 'Список черновиков пользователя',
    type: ReceiptDto,
    isArray: true,
  })
  async getDrafts(@Req() req: Request & { user: User }): Promise<Receipt[]> {
    return this.receiptService.getUserDrafts(req.user);
  }

  @Put('publish/:id')
  @Authorized()
  @ApiOperation({ summary: 'Опубликовать черновик рецепта' })
  @ApiOkResponse({
    description: 'Черновик успешно опубликован',
    type: ReceiptDto,
  })
  @ApiNotFoundResponse({ description: 'Черновик не найден', type: ErrorDto })
  @ApiForbiddenResponse({ description: 'Доступ запрещён', type: ErrorDto })
  @ApiBadRequestResponse({
    description: 'Нельзя публиковать не-черновики',
    type: ErrorDto,
  })
  async publishDraft(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ): Promise<Receipt> {
    return this.receiptService.publishDraft(+id, req.user);
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Получить все опубликованные рецепты' })
  @ApiOkResponse({
    description: 'Список опубликованных рецептов',
    type: ReceiptDto,
    isArray: true,
  })
  async getAllPublished(): Promise<Receipt[]> {
    return this.receiptService.getAllPublished();
  }
}
