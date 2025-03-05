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

class CategoriesSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const categoriesAmount = 20;
    const categoryFactory = factoryManager.get(Category);

    for (let i = 0; i < categoriesAmount; i++) {
      const category = await categoryFactory.make();
      await dataSource.getRepository(Category).save(category);
      await dataSource.getRepository(Subcategory).save(category.subcategories);
    }
  }
}

const CategoriesFactory = setSeederFactory(Category, (faker) => {
  const subcategoriesAmount = 5;
  const category = new Category();
  category.id = faker.number.int({ min: 1, max: 2000000 });
  category.name = faker.string.uuid();

  const subcategories = new Array<Subcategory>();
  for (let i = 0; i < subcategoriesAmount; i++) {
    const subcategory = new Subcategory();
    subcategory.id = faker.number.int({ min: 1, max: 2000000 });
    subcategory.name = faker.string.uuid();
    subcategory.parentCategory = category;
    subcategories.push(subcategory);
  }
  category.subcategories = subcategories;

  console.log(category);
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

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
