import {
  IsString,
  IsOptional,
  IsArray,
} from "class-validator";

import { School } from "src/modules/auth/dto/auth-user-dto";

export class CreateClassRoomDto {
  @IsString()
  name: string;

  @IsString()
  teacherId: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  subject: string;

  @IsArray()
  @IsOptional()
  studentEmails?: string[];

  @IsOptional()
  file?: Express.Multer.File;

  @IsString()
  school: School;
}