import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '@/infrastructure/config';
import { User } from '@/domain/users/user.entity';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { seedUsers } from '@/infrastructure/database/seeds/users.seed';
import { seedCategories } from '@/infrastructure/database/seeds/categories.seed';

async function seedDatabase(wantToDrop: string) {
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
    console.log('Connected to the database.');

    if (wantToDrop) {
      console.log('Database will be dropped...');
      await dataSource.synchronize(true);
      console.log('Database successfully dropped...');
    }

    await seedUsers(dataSource);

    await seedCategories(dataSource);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
}

const willBeDropped = process.argv[2];
seedDatabase(willBeDropped)
  .then(() => {
    console.log('Seeding database is finished.');
  })
  .catch((error) => {
    console.log('Error occurred when running seeds: ', error);
  });
