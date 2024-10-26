import {
  IsString,
  IsOptional,
} from "class-validator";

export class CreateClassRoomDto {
  @IsString()
  name: string;

  @IsString()
  teacherId: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsOptional()
  file?: Express.Multer.File;
}