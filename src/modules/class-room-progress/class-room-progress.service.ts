import { Injectable } from "@nestjs/common";

import { ClassRoomProgressRepository } from "./class-room-progress.repository";

@Injectable()
export class ClassRoomProgressService {
  public constructor(private readonly classRoomProgressRepository: ClassRoomProgressRepository) {}

  public async getClassRoomProgress(classRoomId: string, assignmentId: string) {
    return this.classRoomProgressRepository.findClassRoomProgress(classRoomId, assignmentId);
  }

  public async updateClassRoomProgress(classRoomId: string, assignmentId: string, studentEmail: string, feedback: string) {
    return this.classRoomProgressRepository.updateClassRoomProgress(classRoomId, assignmentId, studentEmail, feedback);
  }

  public async getClassRoomStudentsProgress(classRoomId: string, assignmentId: string) {
    return this.classRoomProgressRepository.findClassRoomStudentsProgress(classRoomId, assignmentId);
  }
}