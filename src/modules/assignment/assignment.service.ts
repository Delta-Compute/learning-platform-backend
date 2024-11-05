import { Injectable } from "@nestjs/common";

import { AssignmentRepository } from "./assignment.repository";

import { AssignmentDto } from "./entities/assignment.entity";
import { CreateAssignmentDto } from "./dto/create-assignment-dto";
import { UpdateAssignmentDto } from "./dto/update-assignment-dto";

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

  async getAssignmentsByStudentEmail(studentEmail: string) {
    const assignments = await this.assignmentRepository.findAssignmentsByStudentEmail(studentEmail);
    
    return assignments;
  }

  async updateAssignmentById(assignmentId: string, updateAssignmentDto: UpdateAssignmentDto) {
    return await this.assignmentRepository.updateAssignment(assignmentId, updateAssignmentDto);
  }
}