import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class updateCommentaryDTO {

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  idRecipe: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  note: number;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  text: string;
}
