import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { Repository } from 'typeorm';
import {
  CreateSubcategoryParams,
  UpdateSubcategoryParams,
} from '@/application/subcategories/subcategories.types';
import { CategoriesService } from '@/application/categories/categories.service';
import { CATEGORY_DOES_NOT_EXIST_MESSAGE } from '@/interfaces/constants/category-response-messages.constants';
import {
  SUBCATEGORY_DOES_NOT_EXIST_MESSAGE,
  SUBCATEGORY_ALREADY_EXISTS_MESSAGE,
} from '@/interfaces/constants/subcategory-response-messages.constants';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoriesRepository: Repository<Subcategory>,
    @Inject() private categoriesService: CategoriesService,
  ) {}

  async createSubcategory(createSubcategoryParams: CreateSubcategoryParams) {
    const category = await this.categoriesService.findCategoryById(
      createSubcategoryParams.categoryId,
    );
    if (!category) {
      throw new NotFoundException(CATEGORY_DOES_NOT_EXIST_MESSAGE);
    }

    const categorySubcategories = category.subcategories.map((subcategory) => {
      return subcategory.name;
    });
    if (categorySubcategories.includes(createSubcategoryParams.name)) {
      throw new ConflictException(SUBCATEGORY_ALREADY_EXISTS_MESSAGE);
    }

    const subcategory = this.subcategoriesRepository.create({
      name: createSubcategoryParams.name,
      parentCategory: category,
    });
    await this.subcategoriesRepository.save(subcategory);

    return subcategory;
  }

  async updateSubcategory(updateSubcategoryParams: UpdateSubcategoryParams) {
    const category = await this.categoriesService.findCategoryById(
      updateSubcategoryParams.categoryId,
    );
    if (!category) {
      throw new NotFoundException(CATEGORY_DOES_NOT_EXIST_MESSAGE);
    }

    const categorySubcategories = category.subcategories.map((subcategory) => {
      return subcategory.name;
    });
    if (categorySubcategories.includes(updateSubcategoryParams.name)) {
      throw new ConflictException(SUBCATEGORY_ALREADY_EXISTS_MESSAGE);
    }

    const subcategory = await this.subcategoriesRepository.findOne({
      where: {
        id: updateSubcategoryParams.id,
      },
      relations: {
        parentCategory: true,
      },
    });

    if (!subcategory) {
      throw new NotFoundException(SUBCATEGORY_DOES_NOT_EXIST_MESSAGE);
    }

    subcategory.name = updateSubcategoryParams.name;
    await this.subcategoriesRepository.save(subcategory);

    return subcategory;
  }
}
