import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PublishReceiptDto {
  @ApiProperty({ description: 'Заголовок рецепта' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Пошаговый текст рецепта',
  })
  @IsString()
  @IsNotEmpty()
  receiptContent: string;
}
