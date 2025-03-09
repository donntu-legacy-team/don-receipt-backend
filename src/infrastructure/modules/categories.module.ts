import { Module } from '@nestjs/common';
import { CategoriesController } from '@/interfaces/categories/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/domain/categories/category.entity';
import { CategoriesService } from '@/application/categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
