import { ApiProperty } from '@nestjs/swagger';
import { UserRole, User } from '@/domain/users/user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  emailConfirmed: boolean;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  registeredAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(user?: User) {
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
      this.avatarUrl = user.avatarUrl;
      this.emailConfirmed = user.emailConfirmed;
      this.role = user.role;
      this.registeredAt = user.registeredAt;
      this.updatedAt = user.updatedAt;
    }
  }
}
