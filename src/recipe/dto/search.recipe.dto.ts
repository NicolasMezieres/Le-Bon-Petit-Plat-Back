import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class searchDTO {
  page: number;

  @IsString()
  @IsOptional()
  search: string;

  @IsUUID()
  @IsNotEmpty()
  idCategory: string;

  @IsNumberString()
  @IsOptional()
  note: string;
}
