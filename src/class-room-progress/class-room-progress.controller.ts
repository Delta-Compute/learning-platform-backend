import { Get, Param, Patch, Controller, Body } from "@nestjs/common";

import { ClassRoomProgressService } from "./class-room-progress.service";
import { UpdateStudentProgressDto } from "./dto/update-student-progress-dto";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Class room progress")
@Controller()
export class ClassRoomProgressController {
  public constructor(private readonly classRoomProgressService: ClassRoomProgressService) {}

  @ApiOperation({ summary: "Get class room assignments" })
  @Get("/class-room-progress/:classRoomId/:assignmentId")
  public async getClassRoomProgress(
    @Param("classRoomId") classRoomId: string, 
    @Param("assignmentId") assignmentId: string,
  ) {
    return this.classRoomProgressService.getClassRoomProgress(classRoomId, assignmentId);
  }

  @ApiOperation({ summary: "Update class room progress assignments" })
  @Patch("/class-room-progress/update-progress/:classRoomId/:assignmentId")
  public async updateClassRoomProgress(
    @Param("classRoomId") classRoomId: string, 
    @Param("assignmentId") assignmentId: string,
    @Body() progressDto: UpdateStudentProgressDto,
  ) {
    const { studentEmail, feedback } = progressDto;

    return this.classRoomProgressService.updateClassRoomProgress(classRoomId, assignmentId, studentEmail, feedback);
  }

  @ApiOperation({ summary: "Get class room students progress" })
  @Get("/class-room-progress/students-progress/find-progress/:classRoomId")
  public async getClassRoomStudentsProgress(
    @Param("classRoomId") classRoomId: string, 
  ) {
    return this.classRoomProgressService.getClassRoomStudentsProgress(classRoomId);
  }
}