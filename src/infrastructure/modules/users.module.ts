import { Module } from '@nestjs/common';
import { UsersController } from '@/interfaces/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/domain/users/user.entity';
import { UsersService } from '@/application/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
