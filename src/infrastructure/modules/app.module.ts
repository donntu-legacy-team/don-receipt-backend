import { Module } from '@nestjs/common';
import { UsersModule } from '@/infrastructure/modules/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@/infrastructure/config';
import { ConfigModule } from '@nestjs/config';
import { DEVELOPMENT_ENV_PATH } from '@/infrastructure/config/configuration';
import { User } from '@/domain/users/user.entity';

@Module({
  imports: [
    UsersModule,
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
      entities: [User],
    }),
  ],
})
export class AppModule {}
