import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

import { IsOptional, IsString } from "class-validator";

import { SecretWords } from "src/common/types/interfaces/user.interface";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  natureLanguage?: string;

  @IsString()
  @IsOptional()
  foreignLanguage?: string;

  @IsOptional()
  @IsString()
  schoolName?: string;

  @IsOptional()
  secretWords?: SecretWords;

  @IsString()
  @IsOptional()
  userSummary?: string;
}