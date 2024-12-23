import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  Body,
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

import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { School } from "../auth/dto/auth-user-dto";

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
  @Get("/teacher-class-rooms/:teacherId")
  async getAllClassRoomsByUserId(@Param("teacherId") teacherId: string) {
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

  @ApiOperation({ summary: "Get class room report info" })
  @Get("/report/:classRoomId")
  @ApiQuery({
    name: "students",
    type: String,
    isArray: true,
    description: "List of student Ids or user info",
    required: true,
  })
  @ApiQuery({
    name: "from",
    type: Number,
    description: "Start of range",
    required: true,
  })
  @ApiQuery({
    name: "to",
    type: Number,
    description: "End of range",
    required: true,
  })
  async getClassRoomReport(
    @Param("classRoomId") classRoomId: string,
    @Query("students") studentEmails: string[],
    @Query("from") from: number,
    @Query("to") to: number,
  ) {
    return await this.classRoomService.getClassRoomReport(classRoomId, studentEmails, { from, to });
  }

  @ApiOperation({ summary: "Get all class rooms by teacherId" })
  @Patch("/:id")
  @UseInterceptors(FileInterceptor("file", {}))
  async updateClassRoom(
    @Param("id") classRoomId: string, 
    @Body() updateClassRoomDto: UpdateClassRoomDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return file ? 
      this.classRoomService.updateClassRoom(classRoomId, updateClassRoomDto, file) :
      this.classRoomService.updateClassRoom(classRoomId, updateClassRoomDto);
  }
  
  @ApiOperation({ summary: "Update class room student emails" })
  @Patch("/verification-code/:verificationCode/:studentEmail")
  async addNewStudentEmailClassRoom(
    @Param("verificationCode") verificationCode: string,
    @Param("studentEmail") studentEmail: string, 
  ) {
    return await this.classRoomService.addNewStudentToClassRoom(verificationCode, studentEmail);
  }

  @ApiOperation({ summary: "Find class room for student" })
  @Get("/find-class-room/for-student/:email/:school")
  async findClassRoomForStudentByEmail(
    @Param("email") email: string,
    @Param("school") school: School,
  ) {
    return await this.classRoomService.findClassRoomForStudentByEmail(email, school);
  }

  @ApiOperation({ summary: "Delete class room" })
  @Delete("/:id")
  async deleteClassRoom(@Param("id") id: string) {
    return await this.classRoomService.deleteClassRoomById(id);
  }
}
