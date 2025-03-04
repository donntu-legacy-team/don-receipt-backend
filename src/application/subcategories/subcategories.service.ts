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

  // TODO(audworth): переписать на возврат полного объекта (relations: { parentCategory: true })
  async findAll() {
    const subcategories = await this.categoriesRepository.find();
    return subcategories;
  }

  // TODO(audworth): переписать на возврат полного объекта (relations: { parentCategory: true })
  async findSubcategoryById(id: number) {
    const subcategory = await this.categoriesRepository.findOneBy({
      id: id,
    });

    return subcategory;
  }

  // TODO(audworth): переписать на возврат полного объекта (relations: { parentCategory: true })
  async findSubCategoryByName(subcategoryName: string) {
    const subcategory = await this.categoriesRepository.findOneBy({
      name: subcategoryName,
    });

    return subcategory;
  }
}
