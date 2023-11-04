import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeVisibilityDto {
  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isPublic: boolean;
}
