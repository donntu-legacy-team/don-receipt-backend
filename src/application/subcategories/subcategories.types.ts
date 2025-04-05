import { Category } from '@/domain/categories/category.entity';

export type CreateSubcategoryParams = {
  name: string;
  parentCategory: Category;
};

export type UpdateSubcategoryParams = {
  id: number;
  name: string;
};
