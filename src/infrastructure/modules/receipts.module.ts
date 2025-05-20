import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptService } from '@/application/receipts/receipts.service';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { ReceiptsController } from '@/interfaces/receipts/receipts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt])],
  providers: [ReceiptService],
  controllers: [ReceiptsController],
  exports: [ReceiptService],
})
export class ReceiptsModule {}
