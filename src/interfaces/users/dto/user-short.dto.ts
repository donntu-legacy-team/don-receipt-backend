import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/domain/users/user.entity';

export class UserShortDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  constructor(user?: User) {
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.avatarUrl = user.avatarUrl;
    }
  }
}
