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
    const categories = await this.categoriesRepository.find();
    return categories;
  }

  async findCategoryById(id: number) {
    const category = await this.categoriesRepository.findOneBy({
      id: id,
    });

    return category;
  }

  async findCategoryByName(categoryName: string) {
    const category = await this.categoriesRepository.findOneBy({
      name: categoryName,
    });

    return category;
  }
}
