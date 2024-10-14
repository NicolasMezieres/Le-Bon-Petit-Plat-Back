import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ingredient, step } from './create.recipe.dto';

export class updateRecipeDTO {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  picture: string;

  @IsUUID()
  @IsOptional()
  idCategory: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(50)
  piece: number;

  @IsString()
  @IsOptional()
  preparationTime: string;

  @IsString()
  @IsOptional()
  cookingTime: string;

  @IsString()
  @IsOptional()
  standingTime: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(3)
  difficulty: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ingredient)
  ingredient: string[];

  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => step)
  cookingStep: string[];
}
