import { Injectable } from '@nestjs/common';
import { CreateUserParams } from '@/application/users/users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/domain/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserParams: CreateUserParams) {
    const foundUser = await this.usersRepository.findOne({
      where: [
        { username: createUserParams.username },
        { email: createUserParams.email },
      ],
    });

    if (foundUser) {
      return null;
    }

    const passwordHash = await bcrypt.hash(createUserParams.password, 10);

    const user = this.usersRepository.create({
      username: createUserParams.username,
      email: createUserParams.email,
      password_hash: passwordHash,
      registered_at: new Date(),
      updated_at: new Date(),
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
