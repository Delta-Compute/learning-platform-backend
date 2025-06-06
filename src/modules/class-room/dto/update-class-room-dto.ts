import { School } from './../../auth/dto/auth-user-dto';
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
  
  @IsOptional()
  @IsString()
  learningPlan?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  file?: Express.Multer.File;

  @IsString()
  @IsOptional()
  school?: School;
}