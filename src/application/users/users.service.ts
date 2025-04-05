import { Injectable } from '@nestjs/common';
import { CreateUserParams } from '@/application/users/users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/domain/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from '@/infrastructure/config/configuration';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserParams: CreateUserParams) {
    const foundUser = await this.usersRepository
      .createQueryBuilder('u')
      .where('LOWER(u.username) = LOWER(:username)', {
        username: createUserParams.username,
      })
      .orWhere('LOWER(u.email) = LOWER(:email)', {
        email: createUserParams.email,
      })
      .getOne();

    if (foundUser) {
      return null;
    }

    const saltRounds = config().security.bcryptSaltRounds;
    const hashedPassword = await bcrypt.hash(
      createUserParams.password,
      saltRounds,
    );

    const user = this.usersRepository.create({
      username: createUserParams.username,
      email: createUserParams.email,
      passwordHash: hashedPassword,
    });

    await this.usersRepository.save(user);
    return user;
  }

  async findUserById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async findUserByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
