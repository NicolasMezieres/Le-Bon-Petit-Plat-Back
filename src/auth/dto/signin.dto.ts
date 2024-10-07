import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class signinDTO {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
