import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private categoriesRepository: Repository<Subcategory>,
  ) {}

  async findAll() {
    // TODO(audworth): проверить работу метода find и добавить параметры если потребуется
    const subcategories = await this.categoriesRepository.find();
    return subcategories;
  }

  async findSubcategoryById(id: number) {
    const subcategory = await this.categoriesRepository.findOneBy({
      id: id,
    });

    return subcategory;
  }

  async findSubCategoryByName(subcategoryName: string) {
    const subcategory = await this.categoriesRepository.findOneBy({
      name: subcategoryName,
    });

    return subcategory;
  }
}
