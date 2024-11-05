import {
  IsString,
  IsOptional,
  IsArray,
} from "class-validator";

export class UpdateClassRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsOptional()
  studentEmails?: string[];

  @IsOptional()
  assignmentIds?: string[];
  
  @IsString()
  learningPlan?: string;

  @IsString()
  summary?: string;
}