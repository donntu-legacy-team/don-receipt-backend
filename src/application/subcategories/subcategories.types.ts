import { Category } from '@/domain/categories/category.entity';

export type CreateSubcategoryParams = {
  name: string;
  parentCategory: Category;
};
