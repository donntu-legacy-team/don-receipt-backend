import { ApiProperty } from '@nestjs/swagger';
import { Receipt, ReceiptStatus } from '@/domain/receipts/receipt.entity';
import { SubcategoryDto } from '@/interfaces/subcategories/dto/subcategory.dto';

export class ReceiptDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор рецепта' })
  id?: number;

  @ApiProperty({ example: 'Борщ', description: 'Заголовок рецепта' })
  title?: string;

  @ApiProperty({
    example: 'Нарезать овощи...',
    description: 'Пошаговый текст рецепта',
  })
  receiptContent?: string;

  @ApiProperty({ enum: ReceiptStatus, description: 'Статус рецепта' })
  receiptStatus?: ReceiptStatus;

  @ApiProperty({ example: 42, description: 'ID автора (пользователя)' })
  authorId?: number;

  @ApiProperty({
    example: '2025-05-10T12:34:56.789Z',
    description: 'Дата создания',
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2025-05-10T12:34:56.789Z',
    description: 'Дата последнего обновления',
  })
  updatedAt?: Date;

  @ApiProperty({
    example: '2025-05-10T12:34:56.789Z',
    description: 'Дата публикации рецепта',
    required: false,
    nullable: true,
  })
  publishedAt?: Date | string | null;

  @ApiProperty({ type: SubcategoryDto, required: false, nullable: true })
  subcategory?: SubcategoryDto;

  constructor(receipt?: Receipt) {
    if (!receipt) {
      return;
    }

    this.id = receipt.id;
    this.title = receipt.title ?? '';
    this.receiptContent = receipt.receiptContent ?? '';
    this.receiptStatus = receipt.receiptStatus;
    this.authorId = receipt.author.id;
    this.createdAt = receipt.createdAt;
    this.updatedAt = receipt.updatedAt;
    this.publishedAt = receipt.publishedAt ?? '';

    if (receipt.receiptSubcategories?.length > 0) {
      const subcategory = receipt.receiptSubcategories[0]?.subcategory;
      if (subcategory) {
        this.subcategory = new SubcategoryDto(subcategory);
      }
    }
  }
}
