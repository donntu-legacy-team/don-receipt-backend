import { Module } from '@nestjs/common';
import { UsersModule } from '@/infrastructure/modules/users.module';
import { CategoriesModule } from '@/infrastructure/modules/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@/infrastructure/config';
import { ConfigModule } from '@nestjs/config';
import { DEVELOPMENT_ENV_PATH } from '@/infrastructure/config/configuration';
import { User } from '@/domain/users/user.entity';
import { Category } from '@/domain/categories/category.entity';
import { Subcategory } from '@/domain/subcategories/subcategory.entity';
import { AuthModule } from '@/infrastructure/modules/auth.module';

@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: DEVELOPMENT_ENV_PATH,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config().database.host,
      port: config().database.port,
      username: config().database.username,
      password: config().database.password,
      database: config().database.databaseName,
      synchronize: config().database.synchronize,
      migrationsTransactionMode: 'each',
      entities: [User, Category, Subcategory],
    }),
  ],
})
export class AppModule {}
