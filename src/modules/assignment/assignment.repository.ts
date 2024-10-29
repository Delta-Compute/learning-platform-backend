import * as admin from "firebase-admin";

import { NotFoundException } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

import { AssignmentDto } from "./entities/assignment.entity";

@Injectable()
export class AssignmentRepository {
  private db: FirebaseFirestore.Firestore;
  private assignmentCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private classRoomCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.assignmentCollection = this.db.collection("assignments");
    this.classRoomCollection = this.db.collection("class-rooms");
  }

  public async create(createAssignmentDto: AssignmentDto) {
    const reference = await this.assignmentCollection.add(createAssignmentDto.toPlainObject());
    const document = await reference.get();

    const classRoomRef = this.classRoomCollection.doc(createAssignmentDto.classRoomId);
    const classRoomDoc = await classRoomRef.get();

    if (!classRoomDoc.exists) {
      throw new NotFoundException("Class room not found");
    }
    
    await classRoomRef.update({
      assignmentIds: admin.firestore.FieldValue.arrayUnion(reference.id),
    });

    console.log("");

    return {
      ...document.data(),
      id: document.id,
    };
  }

  public async findAllByClassRoomId(classRoomId: string): Promise<AssignmentDto[]> {
    const classRoomRef = this.classRoomCollection.doc(classRoomId);
    const classRoomDoc = await classRoomRef.get();

    const { assignmentIds } = classRoomDoc.data() as { assignmentIds: string[] };

    if (!assignmentIds || assignmentIds.length === 0) {
      return [];
    }

    const assignments: AssignmentDto[] = [];

    for (const assignmentId of assignmentIds) {
      const assignmentDoc = await this.assignmentCollection.doc(assignmentId).get();
      if (assignmentDoc.exists) {
        assignments.push(new AssignmentDto({
          ...assignmentDoc.data(),
          id: assignmentDoc.id,
        }));
      }
    }
  
    return assignments;
  }
}