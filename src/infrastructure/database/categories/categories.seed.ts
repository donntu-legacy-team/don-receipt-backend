import 'reflect-metadata';
import { config } from '@/infrastructure/config/configuration';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Category } from '@/domain/categories/category.entity';
import { CategoriesFactory } from '@/infrastructure/database/categories/factories/categories.factory';
import { CategoriesSeeder } from '@/infrastructure/database/categories/seeders/categories.seeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: config().database.host,
  port: config().database.port,
  username: config().database.username,
  password: config().database.password,
  database: config().database.databaseName,
  synchronize: config().database.synchronize,
  migrationsTransactionMode: 'each',

  entities: [Category],

  factories: [CategoriesFactory],
  seeds: [CategoriesSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
