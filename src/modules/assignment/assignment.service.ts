import { Injectable } from "@nestjs/common";

import { AssignmentRepository } from "./assignment.repository";

import { AssignmentDto } from "./entities/assignment.entity";
import { CreateAssignmentDto } from "./dto/create-assignment-dto";

@Injectable()
export class AssignmentService {
  public constructor(
    public readonly assignmentRepository: AssignmentRepository,
  ) {}

  async createAssignment(createAssignmentDto: CreateAssignmentDto) {
    const classRoom = await this.assignmentRepository.create(
      new AssignmentDto({
        ...createAssignmentDto,
        createdAt: new Date().getTime(),
      }),
    );

    return classRoom;
  } 

  async getClassRoomAssignments(classRoomId: string) {
    const assignments = await this.assignmentRepository.findAllByClassRoomId(classRoomId);

    return assignments;
  }
}