import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class createCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
