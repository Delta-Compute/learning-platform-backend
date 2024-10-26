import {
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
  
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  password: string;
}