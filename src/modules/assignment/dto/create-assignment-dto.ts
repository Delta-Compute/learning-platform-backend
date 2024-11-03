import {
  IsNumber,
  IsString,
  IsDate,
} from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  classRoomId: string;

  @IsString()
  description: string;

  @IsString()
  topic: string;

  @IsString()
  title: string;

  @IsNumber()
  createdAt: number;

  @IsDate()
  deadline: Date;
}