import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptService } from '@/application/receipts/receipts.service';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { ReceiptsController } from '@/interfaces/receipts/receipts.controller';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { ReceiptSubcategory } from '@/domain/receipts/receipt-subcategory.entity';
import { Category } from '@/domain/categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Receipt,
      Subcategory,
      ReceiptSubcategory,
      Category,
    ]),
  ],
  providers: [ReceiptService],
  controllers: [ReceiptsController],
  exports: [ReceiptService],
})
export class ReceiptsModule {}
