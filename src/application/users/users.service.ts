import { Injectable } from '@nestjs/common';
import { CreateUserParams } from '@/application/users/users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/domain/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserParams: CreateUserParams) {
    const foundUser = await this.findUserByUsername(createUserParams.username);

    if (foundUser) {
      return null;
    }

    const user = this.usersRepository.create({
      username: createUserParams.username,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOneBy({
      id: id,
    });

    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({
      username: username,
    });

    return user;
  }
}
