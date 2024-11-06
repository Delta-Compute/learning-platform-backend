import {
  IsNumber,
  IsOptional,
  IsString,
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

  @IsOptional()
  @IsNumber()
  createdAt?: number;

  @IsNumber()
  deadline: number;

  @IsNumber()
  timeToDiscuss: number;
}