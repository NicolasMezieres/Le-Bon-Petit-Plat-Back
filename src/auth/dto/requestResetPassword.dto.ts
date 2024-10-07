import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class requestResetPasswordDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
