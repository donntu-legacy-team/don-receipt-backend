import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty()
  message: string;
}
