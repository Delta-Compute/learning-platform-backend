import {
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

import { AuthType } from "src/modules/user/dto/create-user.dto";

import { SecretWords } from "src/common/types/interfaces/user.interface";

type UserRole = "student" | "teacher";

export enum School {
  Default = "def",
  MapleBear = "maple-bear",
  AdeliaCosta = "adelia-costa",
  SB = "sb",
  Educare = "educare",
  Beka = "beka",
  Cincinatti = "cincinatti",
  StMary = "st-mary",
};

export class AuthUserDto {
  @IsOptional()
  role?: UserRole;

  @IsString()
  school: School;

  @IsString()
  auth: AuthType;
}

export class SignInDto extends AuthUserDto {
  @IsString()
  email: string;

  @IsString()
  password?: string;

  @IsOptional()
  secretWords?: SecretWords;
}

export class SignUpDto extends SignInDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  secretWords?: SecretWords;
}
