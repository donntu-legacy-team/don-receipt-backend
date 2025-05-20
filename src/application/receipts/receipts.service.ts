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
import { CreateReceiptDraftDto } from '@/interfaces/receipts/dto/create-receipt-draft.dto';
import { UpdateReceiptDraftDto } from '@/interfaces/receipts/dto/update-receipt-draft.dto';
import { GetReceiptsQueryDto } from '@/interfaces/receipts/dto/get-receipts-query.dto';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { ReceiptSubcategory } from '@/domain/receipts/receipt-subcategory.entity';
import { Category } from '@/domain/categories/category.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(ReceiptSubcategory)
    private readonly receiptSubcategoryRepository: Repository<ReceiptSubcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createDraft(createDto: CreateReceiptDraftDto, user: User) {
    const receipt = this.receiptRepository.create({
      title: createDto.title,
      receiptContent: createDto.receiptContent,
      receiptStatus: ReceiptStatus.DRAFT,
      author: user,
    });

    const savedReceipt = await this.receiptRepository.save(receipt);

    if (createDto.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: createDto.subcategoryId },
        relations: ['parentCategory'],
      });
      if (!subcategory) {
        throw new NotFoundException('Подкатегория не найдена');
      }
      await this.receiptSubcategoryRepository.save({
        receiptId: savedReceipt.id,
        subcategoryId: subcategory.id,
      });
    }

    const result = await this.receiptRepository.findOne({
      where: { id: savedReceipt.id },
      relations: [
        'author',
        'receiptSubcategories',
        'receiptSubcategories.subcategory',
        'receiptSubcategories.subcategory.parentCategory',
      ],
    });

    if (!result) {
      throw new NotFoundException('Рецепт не найден после создания');
    }

    return result;
  }

  async updateDraft(id: number, user: User, updateDto: UpdateReceiptDraftDto) {
    const receipt = await this.receiptRepository.findOne({
      where: { id },
      relations: [
        'author',
        'receiptSubcategories',
        'receiptSubcategories.subcategory',
      ],
    });
    if (!receipt) {
      throw new NotFoundException('Рецепт не найден');
    }
    if (receipt.author.id !== user.id) {
      throw new ForbiddenException(
        'Вы можете редактировать только свои черновики',
      );
    }
    if (receipt.receiptStatus !== ReceiptStatus.DRAFT) {
      throw new BadRequestException('Только черновики можно редактировать');
    }

    const updatedReceipt = {
      ...receipt,
      title: updateDto.title ?? receipt.title,
      receiptContent: updateDto.receiptContent ?? receipt.receiptContent,
    };

    const savedReceipt = await this.receiptRepository.save(updatedReceipt);

    if (updateDto.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: updateDto.subcategoryId },
        relations: ['parentCategory'],
      });
      if (!subcategory) {
        throw new NotFoundException('Подкатегория не найдена');
      }
      await this.receiptSubcategoryRepository.delete({ receiptId: receipt.id });
      await this.receiptSubcategoryRepository.save({
        receiptId: savedReceipt.id,
        subcategoryId: subcategory.id,
      });
    }

    return this.receiptRepository.findOne({
      where: { id: savedReceipt.id },
      relations: [
        'author',
        'receiptSubcategories',
        'receiptSubcategories.subcategory',
        'receiptSubcategories.subcategory.parentCategory',
      ],
    });
  }

  async getUserDrafts(user: User): Promise<Receipt[]> {
    return this.receiptRepository.find({
      where: {
        author: { id: user.id },
        receiptStatus: ReceiptStatus.DRAFT,
      },
      relations: [
        'author',
        'receiptSubcategories',
        'receiptSubcategories.subcategory',
        'receiptSubcategories.subcategory.parentCategory',
      ],
    });
  }

  async publishDraft(id: number, user: User): Promise<Receipt> {
    const receipt = await this.receiptRepository.findOne({
      where: { id },
      relations: [
        'author',
        'receiptSubcategories',
        'receiptSubcategories.subcategory',
      ],
    });
    if (!receipt) {
      throw new NotFoundException('Рецепт не найден');
    }
    if (receipt.author.id !== user.id) {
      throw new ForbiddenException(
        'Вы можете публиковать только свои черновики',
      );
    }
    if (receipt.receiptStatus !== ReceiptStatus.DRAFT) {
      throw new BadRequestException('Только черновики можно публиковать');
    }

    if (!receipt.receiptSubcategories?.length) {
      throw new BadRequestException(
        'Необходимо указать подкатегорию перед публикацией',
      );
    }

    receipt.receiptStatus = ReceiptStatus.PUBLISHED;
    receipt.publishedAt = new Date();

    return await this.receiptRepository.save(receipt);
  }

  async getAllPublished(query: GetReceiptsQueryDto): Promise<Receipt[]> {
    const queryBuilder = this.receiptRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.author', 'author')
      .leftJoinAndSelect('receipt.receiptSubcategories', 'receiptSubcategories')
      .leftJoinAndSelect('receiptSubcategories.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.parentCategory', 'category')
      .where('receipt.receiptStatus = :status', {
        status: ReceiptStatus.PUBLISHED,
      });

    if (query.searchText) {
      queryBuilder.andWhere(
        '(receipt.title ILIKE :searchText OR receipt.receiptContent ILIKE :searchText)',
        { searchText: `%${query.searchText}%` },
      );
    }

    if (query.authorId) {
      queryBuilder.andWhere('author.id = :authorId', {
        authorId: query.authorId,
      });
    }

    if (query.subcategoryId) {
      queryBuilder.andWhere('subcategory.id = :subcategoryId', {
        subcategoryId: query.subcategoryId,
      });
    } else if (query.categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    return queryBuilder.getMany();
  }
}
