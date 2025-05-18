import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { RecipeService } from '@/application/receipts/receipts.service';
import { ReceiptsController } from '@/interfaces/receipts/receipts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt])],
  providers: [RecipeService],
  controllers: [ReceiptsController],
  exports: [RecipeService],
})
export class ReceiptsModule {}
