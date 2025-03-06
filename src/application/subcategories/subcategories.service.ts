import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoriesRepository: Repository<Subcategory>,
  ) {}

  // TODO(audworth): переписать на возврат полного объекта (relations: { parentCategory: true })
  async findAll() {
    const subcategories = await this.subcategoriesRepository.find();
    return subcategories;
  }

  // TODO(audworth): переписать на возврат полного объекта (relations: { parentCategory: true })
  async findSubcategoryById(id: number) {
    const subcategory = await this.subcategoriesRepository.findOneBy({
      id: id,
    });

    return subcategory;
  }

  // TODO(audworth): переписать на возврат полного объекта (relations: { parentCategory: true })
  async findSubcategoryByName(subcategoryName: string) {
    const subcategory = await this.subcategoriesRepository.findOneBy({
      name: subcategoryName,
    });

    return subcategory;
  }
}
