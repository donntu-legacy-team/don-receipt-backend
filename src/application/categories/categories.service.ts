import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/domain/categories/category.entity';
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from '@/application/categories/categories.types';
import {
  CATEGORY_ALREADY_EXISTS_MESSAGE,
  CATEGORY_DOES_NOT_EXIST_MESSAGE,
} from '@/interfaces/constants/category-response-messages.constants';

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
    const existingCategory = await this.categoriesRepository.findOneBy({
      name: updateCategoryParams.name,
    });

    if (existingCategory) {
      throw new ConflictException(CATEGORY_ALREADY_EXISTS_MESSAGE);
    }

    const categoryToUpdate = await this.categoriesRepository.findOne({
      where: {
        id: updateCategoryParams.id,
      },
      relations: {
        subcategories: true,
      },
    });

    if (!categoryToUpdate) {
      throw new NotFoundException(CATEGORY_DOES_NOT_EXIST_MESSAGE);
    }

    categoryToUpdate.name = updateCategoryParams.name;
    await this.categoriesRepository.save(categoryToUpdate);

    return categoryToUpdate;
  }
}
