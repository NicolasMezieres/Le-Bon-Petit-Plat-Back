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

export class ingredient {
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  ingredient: string;
}
export class step {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  step: string;
}
export class createRecipeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  picture: string;

  @IsString()
  @IsNotEmpty()
  nameCategory: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(50)
  piece: number;

  @IsString()
  @IsNotEmpty()
  preparationTime: string;

  @IsString()
  @IsOptional()
  cookingTime: string;

  @IsString()
  @IsOptional()
  standingTime: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(3)
  difficulty: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ingredient)
  ingredient: ingredient[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => step)
  cookingStep: string[];
}
