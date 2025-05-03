import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/domain/categories/category.entity';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
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

  async createCategory(createCategoryParams: CreateCategoryParams) {
    const foundCategory = await this.categoriesRepository.findOne({
      where: {
        name: createCategoryParams.name,
      },
      relations: {
        subcategories: true,
      },
    });

    if (foundCategory) {
      return null;
    }

    const category = this.categoriesRepository.create({
      name: createCategoryParams.name,
      subcategories: [],
    });
    await this.categoriesRepository.save(category);

    return category;
  }

  async updateCategory(updateCategoryParams: UpdateCategoryParams) {
    const category = await this.categoriesRepository.findOne({
      where: {
        id: updateCategoryParams.id,
      },
      relations: {
        subcategories: true,
      },
    });

    if (!category) {
      return null;
    }

    category.name = updateCategoryParams.name;
    await this.categoriesRepository.save(category);

    return category;
  }
}
