// src/application/receipts/receipts.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt, ReceiptStatus } from '@/domain/receipts/receipt.entity';
import { User } from '@/domain/users/user.entity';
import { CreateRecipeDraftDto } from '@/interfaces/receipts/dto/create-recipe-draft.dto';
import { UpdateRecipeDraftDto } from '@/interfaces/receipts/dto/update-recipe-draft.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Receipt)
    private readonly recipeRepository: Repository<Receipt>,
  ) {}

  async createDraft(
    user: User,
    createDto: CreateRecipeDraftDto,
  ): Promise<Receipt> {
    const recipe = this.recipeRepository.create({
      ...createDto,
      receiptStatus: ReceiptStatus.DRAFT,
      author: user,
    });
    return await this.recipeRepository.save(recipe);
  }

  async updateDraft(
    id: number,
    user: User,
    updateDto: UpdateRecipeDraftDto,
  ): Promise<Receipt> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    if (recipe.author.id !== user.id) {
      throw new ForbiddenException('You can only edit your own drafts');
    }
    if (recipe.receiptStatus !== ReceiptStatus.DRAFT) {
      throw new BadRequestException('Only drafts can be edited');
    }

    Object.assign(recipe, updateDto);
    return await this.recipeRepository.save(recipe);
  }

  async getUserDrafts(user: User): Promise<Receipt[]> {
    return this.recipeRepository.find({
      where: {
        author: { id: user.id },
        receiptStatus: ReceiptStatus.DRAFT, // ← enum
      },
    });
  }

  async publishDraft(id: number, user: User): Promise<Receipt> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    if (recipe.author.id !== user.id) {
      throw new ForbiddenException('You can only publish your own drafts');
    }
    if (recipe.receiptStatus !== ReceiptStatus.DRAFT) {
      throw new BadRequestException('Recipe is not a draft');
    }

    recipe.receiptStatus = ReceiptStatus.PUBLISHED;
    recipe.publishedAt = new Date();
    return await this.recipeRepository.save(recipe);
  }

  async getAllPublished(): Promise<Receipt[]> {
    return this.recipeRepository.find({
      where: { receiptStatus: ReceiptStatus.PUBLISHED }, // ← enum
      relations: ['author'],
    });
  }
}
