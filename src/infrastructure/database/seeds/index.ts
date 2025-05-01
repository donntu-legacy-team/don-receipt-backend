import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '@/infrastructure/config';
import { User } from '@/domain/users/user.entity';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { seedUsers } from '@/infrastructure/database/seeds/users.seed';
import { seedCategories } from '@/infrastructure/database/seeds/categories.seed';

async function seedDatabase() {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: config().database.host,
    port: config().database.port,
    username: config().database.username,
    password: config().database.password,
    database: config().database.databaseName,
    entities: [User, Category, Subcategory],
    synchronize: config().database.synchronize,
  };
  const dataSource = new DataSource(options);

  try {
    await dataSource.initialize();
    console.log('Data source initialized.');

    await seedUsers(dataSource);

    await seedCategories(dataSource);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
    console.log('Data source closed.');
  }
}

// TODO(audworth): Добавить адекватное логгирование
seedDatabase()
  .then(() => {
    console.log('Seeding database is finished.');
  })
  .catch((error) => {
    console.log('Error occurred when running seeds: ', error);
  });
