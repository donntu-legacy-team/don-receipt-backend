import { setSeederFactory } from 'typeorm-extension';
import { Category } from '@/domain/categories/category.entity';

export const CategoriesFactory = setSeederFactory(Category, (faker) => {
  const category = new Category();
  category.id = faker.number.int();
  category.name = faker.string.uuid();
  // TODO(audworth): добавить инициализацию подкатегорий
  return category;
});
