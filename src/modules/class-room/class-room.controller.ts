import { 
  Controller, 
  Post,
  Get,
  UseInterceptors,
  Body,
  Req,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CreateClassRoomDto } from "./dto/create-class-room-dto";
import { ClassRoomService } from "./class-room.service";

import { ApiTags } from "@nestjs/swagger";

@ApiTags("ClassRoom")
@Controller("class-room")
export class ClassRoomController {
  constructor(
    private readonly classRoomService: ClassRoomService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file", {}))
  async createClassRoom(
    @UploadedFile() file: Express.Multer.File,
    @Body() createClassRoomDto: CreateClassRoomDto,
    // @Req() req: Request,
  ) {
    const classRoom = await this.classRoomService.createClassRoom({
      ...createClassRoomDto,
      file,
      // teacherId: req.user.sub,
    });

    return classRoom;
  }

  @Get()
  async findClassRoomById(classRoomId: string) {
    
  }
}