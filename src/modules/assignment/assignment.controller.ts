import { Post, Get, Patch, Param, Body, } from "@nestjs/common";

import { Controller } from "@nestjs/common";
import { AssignmentService } from "./assignment.service";

import { CreateAssignmentDto } from "./dto/create-assignment-dto";
import { UpdateAssignmentDto } from "./dto/update-assignment-dto";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { School } from "../auth/dto/auth-user-dto";

@ApiTags("Assignment")
@Controller()
export class AssignmentController {
  public constructor(private readonly assignmentService: AssignmentService) {}

  @ApiOperation({ summary: "Create an assignment" })
  @Post("/assignments/:school")
  public async createAssignment(
    @Param("school") school: School,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    return this.assignmentService.createAssignment(createAssignmentDto, school);
  }

  @ApiOperation({ summary: "Get class room assignments" })
  @Get("/assignments/:classRoomId")
  public async getClassRoomAssignments(@Param("classRoomId") classRoomId: string) {
    return this.assignmentService.getClassRoomAssignments(classRoomId);
  }

  @ApiOperation({ summary: "Get all assignments for student" })
  @Get("/assignments/find-assignments/:studentEmail")
  async getAssignmentsByStudentEmail(@Param("studentEmail") studentEmail: string) {
    return this.assignmentService.getAssignmentsByStudentEmail(studentEmail);
  }

  @ApiOperation({ summary: "Get all assignments for student" })
  @Patch("/assignments/:assignmentId")
  async updateAssignmentById(
    @Param("assignmentId") assignmentId: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentService.updateAssignmentById(assignmentId, updateAssignmentDto);
  }

  // get for student by email
}