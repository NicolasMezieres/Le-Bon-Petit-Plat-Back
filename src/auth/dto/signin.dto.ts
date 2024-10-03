import { IsNotEmpty, IsString } from 'class-validator';

export class signinDTO {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
