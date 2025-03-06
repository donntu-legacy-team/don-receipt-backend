import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/domain/users/user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar_url: string;

  @ApiProperty()
  email_confirmed: boolean;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  registered_at: Date;

  @ApiProperty()
  updated_at: Date;
}
