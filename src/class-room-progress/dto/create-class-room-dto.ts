import {
  IsBoolean,
  IsDate,
  IsString,
} from "class-validator";

export class CreateClassRoomProgressDto {
  @IsString()
  classRoomId: string;

  @IsString()
  feedback: string;

  @IsString()
  studentId: string;

  @IsBoolean()
  progress: boolean;
}