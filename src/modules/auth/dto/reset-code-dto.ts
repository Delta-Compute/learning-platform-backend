import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { School } from "./auth-user-dto";

export class ResetCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  school: School;
}