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
import { UpdateRecipeDraftDto as UpdateReceiptDraftDto } from '@/interfaces/receipts/dto/update-recipe-draft.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
  ) {}

  async createDraft(
    user: User,
    createDto: CreateRecipeDraftDto,
  ): Promise<Receipt> {
    const recipe = this.receiptRepository.create({
      ...createDto,
      receiptStatus: ReceiptStatus.DRAFT,
      author: user,
    });
    return await this.receiptRepository.save(recipe);
  }

  async updateDraft(id: number, user: User, updateDto: UpdateReceiptDraftDto) {
    const receipt = await this.receiptRepository.findOne({
      where: { id },
      relations: ['author'],
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
      ...updateDto,
    };

    return await this.receiptRepository.save(updatedReceipt);
  }

  async getUserDrafts(user: User): Promise<Receipt[]> {
    return this.receiptRepository.find({
      where: {
        author: { id: user.id },
        receiptStatus: ReceiptStatus.DRAFT,
      },
    });
  }

  async publishDraft(id: number, user: User): Promise<Receipt> {
    const receipt = await this.receiptRepository.findOne({
      where: { id },
      relations: ['author'],
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

    receipt.receiptStatus = ReceiptStatus.PUBLISHED;
    receipt.publishedAt = new Date();

    return await this.receiptRepository.save(receipt);
  }

  async getAllPublished(): Promise<Receipt[]> {
    return this.receiptRepository.find({
      where: { receiptStatus: ReceiptStatus.PUBLISHED },
      relations: ['author'],
    });
  }
}
