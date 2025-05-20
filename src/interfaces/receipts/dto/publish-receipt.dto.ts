import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PublishReceiptDto {
  @ApiProperty({ example: 'Борщ', description: 'Заголовок рецепта' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Нарезать овощи...',
    description: 'Пошаговый текст рецепта',
  })
  @IsString()
  @IsNotEmpty()
  receiptContent: string;
}
