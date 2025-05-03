import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/domain/categories/category.entity';
import {
  CreateCategoriesParams,
  UpdateCategoriesParams,
} from '@/application/categories/categories.types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoriesRepository.find({
      relations: {
        subcategories: true,
      },
    });

    return categories;
  }

  async findCategoryById(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        subcategories: true,
      },
    });

    return category;
  }

  async createCategory(createCategoriesParams: CreateCategoriesParams) {
    const foundCategory = await this.categoriesRepository.findOneBy({
      name: createCategoriesParams.name,
    });

    if (foundCategory) {
      return null;
    }

    const category = this.categoriesRepository.create({
      name: createCategoriesParams.name,
    });
    await this.categoriesRepository.save(category);

    return category;
  }

  async updateCategory(updateCategoriesParams: UpdateCategoriesParams) {
    const category = await this.categoriesRepository.findOneBy({
      id: updateCategoriesParams.id,
    });

    if (!category) {
      return null;
    }

    category.name = updateCategoriesParams.name;
    await this.categoriesRepository.save(category);

    return category;
  }
}
