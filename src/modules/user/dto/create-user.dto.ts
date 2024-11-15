import {
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

export enum AuthType {
  Email = "email",
  Google = "google",
};

export class CreateUserDto {
  @IsString()
  id?: string;

  @IsString()
  school: string;

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

  @IsString()
  auth: AuthType;
}