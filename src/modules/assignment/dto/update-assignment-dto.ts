import {
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateAssignmentDto {
  @IsString()
  @IsOptional()
  summary?: string;
}