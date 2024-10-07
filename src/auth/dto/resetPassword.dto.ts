import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class resetPasswordDTO {
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
  }