import { DataSource, In } from 'typeorm';
import { Receipt, ReceiptStatus } from '@/domain/receipts/receipt.entity';
import { ReceiptSubcategory } from '@/domain/receipts/receipt-subcategory.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { User } from '@/domain/users/user.entity';

type ReceiptSeed = {
  title: string;
  receiptContent: string;
  receiptStatus: ReceiptStatus;
  authorUsername: string;
  subcategories: string[];
  publishedAt?: Date;
};

const receiptSeeds: ReceiptSeed[] = [
  {
    title: 'Крем-суп из тыквы с имбирём',
    receiptContent:
      'Очистить тыкву, нарезать кубиками. Обжарить лук, добавить тыкву и имбирь, влить бульон и варить до мягкости. Влить сливки, пробить блендером, приправить.',
    receiptStatus: ReceiptStatus.PUBLISHED,
    authorUsername: 'ivanov_ivan',
    subcategories: ['Крем-супы'],
    publishedAt: new Date('2024-03-15T10:00:00Z'),
  },
  {
    title: 'Куриный бульон классический',
    receiptContent:
      'Тушку положить в холодную воду, довести до кипения, снять шум. Добавить овощи и специи, варить 2 ч. Процедить.',
    receiptStatus: ReceiptStatus.PUBLISHED,
    authorUsername: 'sergeev_sergey',
    subcategories: ['Бульоны'],
    publishedAt: new Date('2024-03-14T15:30:00Z'),
  },
  {
    title: 'Салат «Греческий»',
    receiptContent:
      'Овощи нарезать крупными кусками, добавить оливки и фету, заправить маслом и посыпать орегано.',
    receiptStatus: ReceiptStatus.DRAFT,
    authorUsername: 'petrova_maria',
    subcategories: ['Овощные салаты'],
    publishedAt: new Date('2025-01-01T00:00:00Z'),
  },
];

export async function seedReceipts(
  ds: DataSource,
  skipChecks: boolean = false,
) {
  console.log(`Seeding receipts (skipChecks=${skipChecks})…`);

  const receiptRepo = ds.getRepository(Receipt);
  const linkRepo = ds.getRepository(ReceiptSubcategory);
  const userRepo = ds.getRepository(User);
  const subRepo = ds.getRepository(Subcategory);

  const usernames = receiptSeeds.map((r) => r.authorUsername);
  const authors = await userRepo.find({ where: { username: In(usernames) } });
  const authorMap = new Map(authors.map((a) => [a.username, a.id]));

  const receiptRows = receiptSeeds.map((seed) => {
    const receipt: {
      title: string;
      receiptContent: string;
      receiptStatus: ReceiptStatus;
      author: { id: number };
      publishedAt: Date;
    } = {
      title: seed.title,
      receiptContent: seed.receiptContent,
      receiptStatus: seed.receiptStatus,
      author: { id: authorMap.get(seed.authorUsername)! },
      publishedAt: seed.publishedAt!,
    };

    return receipt;
  });

  if (skipChecks) {
    await receiptRepo
      .createQueryBuilder()
      .insert()
      .into(Receipt)
      .values(receiptRows)
      .execute();
    console.log('  → All receipts inserted without checks.');
  } else {
    await receiptRepo
      .createQueryBuilder()
      .insert()
      .into(Receipt)
      .values(receiptRows)
      .orIgnore()
      .execute();
    console.log('  → Bulk upsert receipts complete.');
  }

  const titles = receiptSeeds.map((r) => r.title);
  const receipts = await receiptRepo.find({ where: { title: In(titles) } });
  const receiptIdMap = new Map(receipts.map((r) => [r.title, r.id]));

  const subNames = [...new Set(receiptSeeds.flatMap((r) => r.subcategories))];
  const subs = await subRepo.find({ where: { name: In(subNames) } });
  const subIdMap = new Map(subs.map((s) => [s.name, s.id]));

  const linkRows = receiptSeeds.flatMap((seed) =>
    seed.subcategories.map((sub) => ({
      receiptId: receiptIdMap.get(seed.title)!,
      subcategoryId: subIdMap.get(sub)!,
    })),
  );

  if (skipChecks) {
    await linkRepo
      .createQueryBuilder()
      .insert()
      .into(ReceiptSubcategory)
      .values(linkRows)
      .execute();
    console.log('  → All receipt_subcategories inserted without checks.');
  } else if (linkRows.length) {
    await linkRepo
      .createQueryBuilder()
      .insert()
      .into(ReceiptSubcategory)
      .values(linkRows)
      .orIgnore()
      .execute();
    console.log('  → Bulk upsert receipt_subcategories complete.');
  }

  console.log('Finished seeding receipts.');
}
