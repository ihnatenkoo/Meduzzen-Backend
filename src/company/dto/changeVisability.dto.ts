import { IsBoolean } from 'class-validator';

export class ChangeVisibilityDto {
  @IsBoolean()
  readonly isPublic: boolean;
}
