import {
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

import { SecretWords } from "src/common/types/interfaces/user.interface";

export enum AuthType {
  Email = "email",
  Google = "google",
  Ai = "ai",
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

  @IsOptional()
  secretWords?: SecretWords;
}