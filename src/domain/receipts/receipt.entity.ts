import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '@/domain/users/user.entity';
import { ReceiptSubcategory } from '@/domain/receipts/receipt-subcategory.entity';

export enum ReceiptStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ON_MODERATION = 'ON_MODERATION',
  ARCHIVED = 'ARCHIVED',
}

@Entity({ name: 'receipts' })
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  ingredients: string;

  @Column({ type: 'text' })
  receiptContent: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ReceiptStatus,
    default: ReceiptStatus.DRAFT,
  })
  receiptStatus: ReceiptStatus;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(
    () => ReceiptSubcategory,
    (receiptSubcategory) => receiptSubcategory.receipt,
  )
  receiptSubcategories: ReceiptSubcategory[];
}
