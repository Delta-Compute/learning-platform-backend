import { IsString, IsNotEmpty } from "class-validator";
import { School } from "./auth-user-dto";

export class VerifyResetCodeDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  school: School;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}