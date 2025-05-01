import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '@/infrastructure/config';

async function dropDatabase() {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: config().database.host,
    port: config().database.port,
    username: config().database.username,
    password: config().database.password,
    database: config().database.databaseName,
    synchronize: config().database.synchronize,
  };
  const dataSource = new DataSource(options);

  try {
    await dataSource.initialize();
    await dataSource.synchronize(true);
    console.log('Database is successfully dropped.');
  } catch (error) {
    console.error('Error during dropping database:', error);
  } finally {
    await dataSource.destroy();
    console.log('Data source closed.');
  }
}

// TODO(audworth): Добавить адекватное логгирование
dropDatabase()
  .then(() => {
    console.log('Finished dropping database.');
  })
  .catch((error) => {
    console.log('Error occurred when dropping database: ', error);
  });
