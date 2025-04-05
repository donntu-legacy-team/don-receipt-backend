import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { Repository } from 'typeorm';
import { CreateSubcategoryParams } from '@/application/subcategories/subcategories.types';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoriesRepository: Repository<Subcategory>,
  ) {}

  async createSubcategory(createSubcategoryParams: CreateSubcategoryParams) {
    const foundSubcategory = await this.subcategoriesRepository.findOneBy({
      name: createSubcategoryParams.name,
    });

    if (foundSubcategory) {
      return null;
    }

    const subcategory = this.subcategoriesRepository.create({
      name: createSubcategoryParams.name,
      parentCategory: createSubcategoryParams.parentCategory,
    });
    await this.subcategoriesRepository.save(subcategory);

    return subcategory;
  }
}
