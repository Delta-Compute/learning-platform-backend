import {
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  id?: string;

  // @IsString()
  // school: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
  
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  password: string;
}