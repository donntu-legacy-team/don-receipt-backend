import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/domain/categories/category.entity';
import { Repository } from 'typeorm';

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

  async findCategoryByName(categoryName: string) {
    const category = await this.categoriesRepository.findOne({
      where: {
        name: categoryName,
      },
      relations: {
        subcategories: true,
      },
    });

    return category;
  }
}
