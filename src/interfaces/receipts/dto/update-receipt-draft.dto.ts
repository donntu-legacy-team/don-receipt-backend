import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, ValidateIf } from 'class-validator';

export class UpdateReceiptDraftDto {
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
  @ValidateIf((o: UpdateReceiptDraftDto) => !o.subcategoryId)
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false, description: 'ID подкатегории' })
  @IsOptional()
  @ValidateIf((o: UpdateReceiptDraftDto) => !o.categoryId)
  @IsNumber()
  subcategoryId?: number;
}
