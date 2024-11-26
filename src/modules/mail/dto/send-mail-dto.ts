import { IsString } from "class-validator";

export class SendMailDto {
  @IsString()
  email: string;

  @IsString()
  name: string;
}