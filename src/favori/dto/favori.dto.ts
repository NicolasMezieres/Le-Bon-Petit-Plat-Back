import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class favoriDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  idRecipe: string;
}
