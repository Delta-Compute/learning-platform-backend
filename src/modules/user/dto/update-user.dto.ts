import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

import { IsOptional, IsString } from "class-validator";

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
}