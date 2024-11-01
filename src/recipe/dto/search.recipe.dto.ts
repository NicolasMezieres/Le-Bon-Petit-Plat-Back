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

  @IsString()
  @IsOptional()
  nameCategory: string;

  @IsString()
  @IsOptional()
  note: string;
}
