import { ApiProperty } from '@nestjs/swagger';

export class TokensPairDto {
  @ApiProperty({ type: String, description: 'Access Token' })
  accessToken: string;

  @ApiProperty({ type: String, description: 'Refresh Token' })
  refreshToken: string;
}
