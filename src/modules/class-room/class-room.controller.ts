import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  Body,
  // Req,
  UploadedFile,
  Param,
  BadRequestException,
  Query,
  Patch,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CreateClassRoomDto } from "./dto/create-class-room-dto";
import { UpdateClassRoomDto } from "./dto/update-class-room-dto";
import { ClassRoomService } from "./class-room.service";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Class Room")
@Controller("class-room")
export class ClassRoomController {
  constructor(private readonly classRoomService: ClassRoomService) {}

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

  @ApiOperation({ summary: "Get all class rooms by teacherId" })
  @Get("/")
  async getAllClassRoomsByUserId(@Query("teacherId") teacherId: string) {
    if (!teacherId) {
      throw new BadRequestException("teacherId is required");
    }

    try {
      const classRooms =
        await this.classRoomService.findClassesByTeacherId(teacherId);
      return classRooms;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw new BadRequestException("Failed to fetch classrooms");
    }
  }

  @ApiOperation({ summary: "Get all class rooms by teacherId" })
  @Patch("/:id")
  async updateClassRoom(@Param("id") classRoomId: string, @Body() updateClassRoomDto: UpdateClassRoomDto) {
    return this.classRoomService.updateClassRoom(classRoomId, updateClassRoomDto);
  }
  // update class room
}
