import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '@/domain/categories/category.entity';

@Entity({ name: 'subcategories' })
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToOne((type) => Category, (category) => category.subcategories)
  parentCategory: Category;

  public constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
