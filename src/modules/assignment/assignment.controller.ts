import { Post, Get, Param, Body, } from "@nestjs/common";

import { Controller } from "@nestjs/common";
import { AssignmentService } from "./assignment.service";

import { CreateAssignmentDto } from "./dto/create-assignment-dto";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Assignment")
@Controller()
export class AssignmentController {
  public constructor(private readonly assignmentService: AssignmentService) {}

  @ApiOperation({ summary: "Create an assignment" })
  @Post("/assignments")
  public async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.createAssignment(createAssignmentDto);
  }
}