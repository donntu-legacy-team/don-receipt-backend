import { Module } from '@nestjs/common';
import { SubcategoriesController } from '@/interfaces/subcategories/subcategories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { SubcategoriesService } from '@/application/subcategories/subcategories.service';
import { Category } from '@/domain/categories/category.entity';
import { CategoriesService } from '@/application/categories/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subcategory]),
    TypeOrmModule.forFeature([Category]),
  ],
  providers: [SubcategoriesService, CategoriesService],
  controllers: [SubcategoriesController],
})
export class SubcategoriesModule {}
