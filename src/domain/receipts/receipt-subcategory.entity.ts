import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';

@Entity({ name: 'receipts_subcategories' })
export class ReceiptSubcategory {
  @PrimaryColumn()
  receiptId: number;

  @PrimaryColumn()
  subcategoryId: number;

  @ManyToOne(() => Receipt, (receipt) => receipt.receiptSubcategories, {
    onDelete: 'CASCADE',
  })
  receipt: Receipt;

  @ManyToOne(() => Subcategory, { onDelete: 'CASCADE' })
  subcategory: Subcategory;
}
