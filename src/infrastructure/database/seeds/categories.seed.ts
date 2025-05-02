import { DataSource } from 'typeorm';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';

type CategorySeed = {
  name: string;
  subcategories: string[];
};

const categoriesSeeds: CategorySeed[] = [
  {
    name: 'Супы',
    subcategories: [
      'Овощные супы',
      'Крем-супы',
      'Бульоны',
      'Рыбные супы',
      'Мясные супы',
    ],
  },
  {
    name: 'Салаты',
    subcategories: [
      'Овощные салаты',
      'Фруктовые салаты',
      'Мясные салаты',
      'Тёплые салаты',
      'Салаты с морепродуктами',
    ],
  },
  {
    name: 'Основные блюда',
    subcategories: [
      'Мясные блюда',
      'Блюда из птицы',
      'Рыбные блюда',
      'Блюда из овощей',
      'Вегетарианские блюда',
    ],
  },
  {
    name: 'Десерты',
    subcategories: ['Торты', 'Пирожные', 'Муссы', 'Желе', 'Запечённые фрукты'],
  },
  {
    name: 'Напитки',
    subcategories: [
      'Горячие напитки',
      'Холодные напитки',
      'Смузи',
      'Алкогольные напитки',
      'Безалкогольные напитки',
    ],
  },
  {
    name: 'Закуски',
    subcategories: [
      'Холодные закуски',
      'Горячие закуски',
      'Канапе',
      'Сэндвичи',
      'Роллы',
    ],
  },
  {
    name: 'Гарниры',
    subcategories: [
      'Картофельные гарниры',
      'Овощные гарниры',
      'Крупы',
      'Макаронные изделия',
      'Бобовые',
    ],
  },
  {
    name: 'Выпечка',
    subcategories: ['Пироги', 'Булочки', 'Печенье', 'Кексы', 'Хлеб'],
  },
  {
    name: 'Соусы и маринады',
    subcategories: [
      'Томатные соусы',
      'Сливочные соусы',
      'Пряные соусы',
      'Маринады',
      'Пикантные соусы',
    ],
  },
  {
    name: 'Завтраки',
    subcategories: [
      'Каши',
      'Омлеты',
      'Блины',
      'Тосты и бутерброды',
      'Выпечка к чаю',
    ],
  },
];

export async function seedCategories(dataSource: DataSource) {
  console.log('Starting seeding categories...');

  const categoriesRepository = dataSource.getRepository(Category);
  const subcategoriesRepository = dataSource.getRepository(Subcategory);

  for (const seed of categoriesSeeds) {
    const existingCategory = await categoriesRepository.findOneBy({
      name: seed.name,
    });

    if (existingCategory) {
      console.log(`Category "${seed.name}" already exists. Skipping...`);
      continue;
    }

    const category = categoriesRepository.create({
      name: seed.name,
    });
    await categoriesRepository.save(category);

    const subcategories = seed.subcategories.map((subcategoryName) => {
      const subcategory = subcategoriesRepository.create({
        name: subcategoryName,
        parentCategory: category,
      });
      return subcategory;
    });

    category.subcategories = subcategories;

    await categoriesRepository.save(category);
    await subcategoriesRepository.save(category.subcategories);
    console.log(`Category "${category.name}" created.`);
  }

  console.log('Finished seeding categories.');
}
