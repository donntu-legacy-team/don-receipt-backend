import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '@/infrastructure/modules/users.module';
import { CategoriesModule } from '@/infrastructure/modules/categories.module';
import { SubcategoriesModule } from '@/infrastructure/modules/subcategories.module';
import { AuthModule } from '@/infrastructure/modules/auth.module';
import { ReceiptsModule } from '@/infrastructure/modules/receipts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@/infrastructure/config';
import { ConfigModule } from '@nestjs/config';
import { DEVELOPMENT_ENV_PATH } from '@/infrastructure/config/configuration';
import { User } from '@/domain/users/user.entity';
import { Receipt } from '@/domain/receipts/receipt.entity';
import { ReceiptSubcategory } from '@/domain/receipts/receipt-subcategory.entity';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { JwtAuthGuard } from '@/interfaces/guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    SubcategoriesModule,
    AuthModule,
    ReceiptsModule,
    ConfigModule.forRoot({ envFilePath: DEVELOPMENT_ENV_PATH }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config().database.host,
      port: config().database.port,
      username: config().database.username,
      password: config().database.password,
      database: config().database.databaseName,
      synchronize: config().database.synchronize,
      migrationsTransactionMode: 'each',
      entities: [User, Category, Subcategory, Receipt, ReceiptSubcategory],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
