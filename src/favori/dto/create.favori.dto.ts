import { IsNotEmpty, IsString } from "class-validator";

export class createFavoriDTO{
    @IsString()
    @IsNotEmpty()
    idUser: string;
  
    @IsString()
    @IsNotEmpty()
    idRecipe: string;
}