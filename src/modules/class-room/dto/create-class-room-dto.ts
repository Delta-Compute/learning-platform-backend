import {
  IsString,
  IsOptional,
  IsArray,
} from "class-validator";

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
}