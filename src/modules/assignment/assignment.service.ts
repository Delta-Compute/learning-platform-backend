import { Injectable } from "@nestjs/common";

import { AssignmentRepository } from "./assignment.repository";

import { AssignmentDto } from "./entities/assignment.entity";

@Injectable()
export class AssignmentService {
  public constructor(
    public readonly assignmentRepository: AssignmentRepository,
  ) {}

  async createAssignment(createAssignmentDto: any) {
    const classRoom = await this.assignmentRepository.create(
      new AssignmentDto({
        ...createAssignmentDto,
        createdAt: new Date().getTime(),
      }),
    );

    return classRoom;
  } 
}