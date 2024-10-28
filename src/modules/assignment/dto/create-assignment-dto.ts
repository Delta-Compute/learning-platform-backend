import {
  IsDate,
  IsString,
} from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  classRoomId: string;

  @IsString()
  description: string;

  // @IsDate()
  // deadline: Date;
}