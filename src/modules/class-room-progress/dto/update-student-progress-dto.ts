import { IsString } from "class-validator";

export class UpdateStudentProgressDto {
  @IsString()
  studentEmail: string;

  @IsString()
  feedback: string;
}