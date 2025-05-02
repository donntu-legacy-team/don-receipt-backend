import { DataSource } from 'typeorm';
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
    username: 'smirnova_ekaterина',
    email: 'smirnova.екaterина@example.ru',
    password: 'S3cur3Катя!',
    role: UserRole.USER,
  },
  {
    username: 'volkov_dmitry',
    email: 'volkov.dmitry@example.ru',
    password: 'S3cur3Dmitry!',
    role: UserRole.USER,
  },
];

export async function seedUsers(ds: DataSource, skipChecks: boolean = false) {
  console.log(`Seeding users (skipChecks=${skipChecks})…`);

  const repo = ds.getRepository(User);
  const saltRounds = config().security.bcryptSaltRounds;

  const users = await Promise.all(
    userSeeds.map(async ({ username, email, password, role }) => ({
      username,
      email,
      passwordHash: await bcrypt.hash(password, saltRounds),
      role,
      emailConfirmed: false,
    })),
  );

  if (skipChecks) {
    await repo.createQueryBuilder().insert().into(User).values(users).execute();
    console.log('  → All users inserted without checks.');
    return;
  } else {
    await repo
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .onConflict(`("username") DO NOTHING`)
      .execute();
    console.log('  → Bulk upsert users complete.');
  }
}
