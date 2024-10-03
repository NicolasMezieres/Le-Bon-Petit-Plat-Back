import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  max,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';

export class createCommentaryDTO {
  @IsString()
  @IsNotEmpty()
  idUser: string;

  @IsString()
  @IsNotEmpty()
  idRecipe: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  note: number;

  @IsString()
  @IsOptional()
  text: string;

  @IsBoolean()
  @IsOptional()
  isVisible: boolean;
}
