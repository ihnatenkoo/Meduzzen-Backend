import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ default: 'new value', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ default: 'new value', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ default: 'https://avatar.com', required: false })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
