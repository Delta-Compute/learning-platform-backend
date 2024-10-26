import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
} from "class-validator";

type UserRole = "student" | "teacher";

export class AuthUserDto {
  @IsOptional()
  role?: UserRole;
}

export class SignInDto extends AuthUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
