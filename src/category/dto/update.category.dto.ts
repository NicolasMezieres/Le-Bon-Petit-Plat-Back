import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class updateCategoryDTO {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
