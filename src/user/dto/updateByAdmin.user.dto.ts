import { IsBoolean, IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class updateByAdminDTO{
    @IsString()
    @IsOptional()
    @MaxLength(50)
    firstName: string;
  
    @IsString()
    @IsOptional()
    @MaxLength(50)
    lastName: string;
  
    @IsString()
    @IsOptional()
    @IsEmail()
    @MaxLength(320)
    email: string;
  
    @IsString()
    @IsOptional()
    @MaxLength(50)
    username: string;
  
    @IsString()
    @IsOptional()
    @IsStrongPassword()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}