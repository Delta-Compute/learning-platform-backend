import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

import { AuthType } from "src/modules/user/dto/create-user.dto";

type UserRole = "student" | "teacher";

export enum School {
  MappleBear = "maple-bear",
  AdeliaCosta = "adelia-costa",
  SB = "sb",
  Educare = "educare",
  Beka = "beka"
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
  password: string;
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
}
