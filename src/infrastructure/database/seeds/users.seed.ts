import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '@/infrastructure/config/configuration';
import { User, UserRole } from '@/domain/users/user.entity';
import * as bcrypt from 'bcryptjs';

type UserSeed = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

const userSeeds: UserSeed[] = [
  {
    username: 'ivanov_ivan',
    email: 'ivanov.ivan@example.ru',
    password: 'S3cur3Ivanov!',
    role: UserRole.ADMIN,
  },
  {
    username: 'sergeev_sergey',
    email: 'sergeev.sergey@example.ru',
    password: 'S3cur3Sergey!',
    role: UserRole.MODER,
  },
  {
    username: 'petrova_maria',
    email: 'petrova.maria@example.ru',
    password: 'S3cur3Maria!',
    role: UserRole.USER,
  },
  {
    username: 'smirnova_ekaterina',
    email: 'smirnova.ekaterina@example.ru',
    password: 'S3cur3Katya!',
    role: UserRole.USER,
  },
  {
    username: 'volkov_dmitry',
    email: 'volkov.dmitry@example.ru',
    password: 'S3cur3Dmitry!',
    role: UserRole.USER,
  },
];

const options: DataSourceOptions = {
  type: 'postgres',
  host: config().database.host,
  port: config().database.port,
  username: config().database.username,
  password: config().database.password,
  database: config().database.databaseName,
  entities: [User],
  synchronize: config().database.synchronize,
};

const dataSource = new DataSource(options);

async function usersSeed(ds: DataSource) {
  console.log('Starting user seeding...');

  const userRepository = ds.getRepository(User);

  for (const seed of userSeeds) {
    const existingUser = await userRepository.findOne({
      where: [{ username: seed.username }, { email: seed.email }],
    });

    if (existingUser) {
      console.log(`User "${seed.username}" already exists. Skipping...`);
      continue;
    }

    const saltRounds = config().security.bcryptSaltRounds;
    const hashedPassword = await bcrypt.hash(seed.password, saltRounds);

    const user = userRepository.create({
      username: seed.username,
      email: seed.email,
      passwordHash: hashedPassword,
      role: seed.role,
      emailConfirmed: false,
    });

    await userRepository.save(user);
    console.log(`User "${seed.username}" created.`);
  }

  console.log('User seeding finished.');
}

(async () => {
  try {
    await dataSource.initialize();
    console.log('Data source initialized.');

    await usersSeed(dataSource);
  } catch (error) {
    console.error('Error during seeding users:', error);
  } finally {
    await dataSource.destroy();
    console.log('Data source closed.');
  }
})();
