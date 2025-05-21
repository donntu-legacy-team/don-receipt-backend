import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, ValidateIf } from 'class-validator';

export class CreateReceiptDraftDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receiptContent?: string;

  @ApiProperty({ required: false, description: 'ID категории' })
  @IsOptional()
  @ValidateIf((o: CreateReceiptDraftDto) => !o.subcategoryId)
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false, description: 'ID подкатегории' })
  @IsOptional()
  @ValidateIf((o: CreateReceiptDraftDto) => !o.categoryId)
  @IsNumber()
  subcategoryId?: number;
}
