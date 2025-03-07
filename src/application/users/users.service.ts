import { Injectable } from '@nestjs/common';
import { CreateUserParams } from '@/application/users/users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/domain/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserParams: CreateUserParams): Promise<User | null> {
    const usernameLowerCase = createUserParams.username.toLowerCase();
    const emailLowerCase = createUserParams.email.toLowerCase();

    const foundUser = await this.usersRepository.findOne({
      where: [
        { username: usernameLowerCase },
        { email: emailLowerCase },
      ],
    });

    if (foundUser) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    const user = this.usersRepository.create({
      username: usernameLowerCase,
      email: emailLowerCase,
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
