import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @OneToMany((type) => Subcategory, (subcategory) => subcategory.parentCategory)
  subcategories: Subcategory[];
}
