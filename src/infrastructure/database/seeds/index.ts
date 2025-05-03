import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '@/infrastructure/config';

import { User } from '@/domain/users/user.entity';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { ReceiptSubcategory } from '@/domain/receipts/receipt-subcategory.entity';

import { seedUsers } from '@/infrastructure/database/seeds/users.seed';
import { seedCategories } from '@/infrastructure/database/seeds/categories.seed';
import { seedReceipts } from '@/infrastructure/database/seeds/receipts.seed';

async function seedDatabase(shouldDrop: boolean) {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: config().database.host,
    port: config().database.port,
    username: config().database.username,
    password: config().database.password,
    database: config().database.databaseName,
    entities: [User, Category, Subcategory, Receipt, ReceiptSubcategory],
    synchronize: config().database.synchronize,
  };

  const dataSource = new DataSource(options);

  try {
    await dataSource.initialize();
    console.log('Connected to the database.');

    if (shouldDrop) {
      console.log('Database will be dropped...');
      await dataSource.synchronize(true);
      console.log('Database successfully dropped.');
    }

    await seedUsers(dataSource, shouldDrop);
    await seedCategories(dataSource, shouldDrop);
    await seedReceipts(dataSource, shouldDrop);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
}

// TODO: при появлении новых аргументов - понадобится переписать
const arg = process.argv[2];
const shouldDrop = Boolean(arg);

seedDatabase(shouldDrop)
  .then(() => console.log('Seeding database is finished.'))
  .catch((err) => console.error('Error occurred when running seeds:', err));
