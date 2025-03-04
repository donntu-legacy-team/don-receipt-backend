import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Category } from '@/domain/categories/category.entity';

export class CategoriesSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    //const repository = dataSource.getRepository(Category);
    const categoryFactory = factoryManager.get(Category);

    await categoryFactory.saveMany(20);
  }
}
