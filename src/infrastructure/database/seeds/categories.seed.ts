import { DataSource, In } from 'typeorm';
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

export async function seedCategories(
  ds: DataSource,
  skipChecks: boolean = false,
) {
  console.log(`Seeding categories (skipChecks=${skipChecks})…`);

  const catRepo = ds.getRepository(Category);
  const subRepo = ds.getRepository(Subcategory);

  if (skipChecks) {
    await catRepo
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoriesSeeds.map((s) => ({ name: s.name })))
      .execute();
    console.log('  → All categories inserted without checks.');
  } else {
    await catRepo
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoriesSeeds.map((s) => ({ name: s.name })))
      .onConflict(`("name") DO NOTHING`)
      .execute();
    console.log('  → Bulk upsert categories complete.');
  }

  const allNames = categoriesSeeds.map((s) => s.name);
  const cats = await catRepo.find({ where: { name: In(allNames) } });
  const idMap = new Map(cats.map((c) => [c.name, c.id]));

  const subRows = categoriesSeeds.flatMap((seed) =>
    seed.subcategories.map((name) => ({
      name,
      parentCategory: { id: idMap.get(seed.name)! },
    })),
  );

  if (skipChecks) {
    await subRepo
      .createQueryBuilder()
      .insert()
      .into(Subcategory)
      .values(subRows)
      .execute();
    console.log('  → All subcategories inserted without checks.');
  } else {
    const parentIds = Array.from(idMap.values());
    const existing = await subRepo
      .createQueryBuilder('sub')
      .select([
        'sub.name AS name',
        'sub."parentCategoryId" AS "parentCategoryId"',
      ])
      .where('sub."parentCategoryId" IN (:...ids)', { ids: parentIds })
      .getRawMany<{ name: string; parentCategoryId: number }>();

    const existsSet = new Set(
      existing.map((e) => `${e.name}-${e.parentCategoryId}`),
    );
    const toInsert = subRows.filter((r) => {
      const pid = (r.parentCategory as { id: number }).id;
      return !existsSet.has(`${r.name}-${pid}`);
    });

    if (toInsert.length > 0) {
      await subRepo
        .createQueryBuilder()
        .insert()
        .into(Subcategory)
        .values(toInsert)
        .execute();
    }
    console.log('  → Bulk upsert subcategories complete.');
  }

  console.log('Finished seeding categories.');
}
