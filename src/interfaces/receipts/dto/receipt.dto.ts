import { ApiProperty } from '@nestjs/swagger';
import { ReceiptStatus } from '@/domain/receipts/receipt.entity';

export class ReceiptDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор рецепта' })
  id: number;

  @ApiProperty({ example: 'Борщ', description: 'Заголовок рецепта' })
  title: string;

  @ApiProperty({
    example: 'Нарезать овощи...',
    description: 'Пошаговый текст рецепта',
  })
  receiptContent: string;

  @ApiProperty({ enum: ReceiptStatus, description: 'Статус рецепта' })
  receiptStatus: ReceiptStatus;

  @ApiProperty({ example: 42, description: 'ID автора (пользователя)' })
  authorId: number;

  @ApiProperty({
    example: '2025-05-10T12:34:56.789Z',
    description: 'Дата создания',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-10T12:34:56.789Z',
    description: 'Дата последнего обновления',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2025-05-10T12:34:56.789Z',
    description: 'Дата публикации рецепта',
    required: false,
    nullable: true,
  })
  publishedAt: Date | null;
}
