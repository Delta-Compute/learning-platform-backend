import { 
  Controller, 
  Post,
  Get,
  UseInterceptors,
  Body,
  // Req,
  UploadedFile,
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CreateClassRoomDto } from "./dto/create-class-room-dto";
import { ClassRoomService } from "./class-room.service";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Class Room")
@Controller("class-room")
export class ClassRoomController {
  constructor(
    private readonly classRoomService: ClassRoomService,
  ) {}

  @ApiOperation({ summary: "Create class room" })
  @UseInterceptors(FileInterceptor("file", {}))
  @Post("/")
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

  @ApiOperation({ summary: "Find class room by id" })
  @Get("/:id")
  async findClassRoomById(@Param("id") id: string) {
    const classRoom = await this.classRoomService.findClassRoomById(id);

    return classRoom;
  }

  // update class room
}