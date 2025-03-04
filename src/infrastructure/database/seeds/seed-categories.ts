import 'reflect-metadata';
import {
  Seeder,
  SeederFactoryManager,
  setSeederFactory,
} from 'typeorm-extension';
import { config } from '@/infrastructure/config/configuration';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';

type CategorySeed = {
  name: string;
  subcategories: string[];
};

const seedCategories: CategorySeed[] = [
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

class CategoriesSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    const categoryFactory = factoryManager.get(Category);

    for (let i = seedCategories.length; i > 0; i--) {
      const category = await categoryFactory.make();
      await dataSource.getRepository(Category).save(category);
      await dataSource.getRepository(Subcategory).save(category.subcategories);
      seedCategories.pop();
    }
  }
}

const CategoriesFactory = setSeederFactory(Category, (faker): Category => {
  const categorySeed = seedCategories.at(-1);
  if (!categorySeed) {
    throw new Error(
      'Произошла ошибка при получении сида из заранее заготовленных данных',
    );
  }

  const category = new Category();
  category.id = faker.number.int({ min: 1, max: 20000 });
  category.name = categorySeed.name;
  category.subcategories = categorySeed.subcategories.map((subcategoryName) => {
    const subcategory = new Subcategory();
    subcategory.id = faker.number.int({ min: 1, max: 50000 });
    subcategory.name = subcategoryName;
    subcategory.parentCategory = category;
    return subcategory;
  });

  return category;
});

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: config().database.host,
  port: config().database.port,
  username: config().database.username,
  password: config().database.password,
  database: config().database.databaseName,
  synchronize: config().database.synchronize,
  migrationsTransactionMode: 'each',
  entities: [Category, Subcategory],
  factories: [CategoriesFactory],
  seeds: [CategoriesSeeder],
};

(async () => {
  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
})();
