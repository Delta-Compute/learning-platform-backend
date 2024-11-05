import * as admin from "firebase-admin";

import { NotFoundException } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

import { AssignmentDto } from "./entities/assignment.entity";
import { UpdateAssignmentDto } from "./dto/update-assignment-dto";

@Injectable()
export class AssignmentRepository {
  private db: FirebaseFirestore.Firestore;
  private assignmentCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private classRoomCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private classRoomsProgressCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private usersCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.assignmentCollection = this.db.collection("assignments");
    this.classRoomCollection = this.db.collection("class-rooms");
    this.classRoomsProgressCollection = this.db.collection("class-rooms-progress");
    this.usersCollection = this.db.collection("users");
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

    const classRoomData = classRoomDoc.data();
    const studentEmails = classRoomData?.studentEmails as string[];

    // add array with user emails 

    if (studentEmails.length > 0) {
      const studentsProgress = studentEmails.map(email => ({
        studentEmail: email,
        progress: false,
        feedback: "",
      }));
  
      const classRoomProgressRef = this.classRoomsProgressCollection.doc();

      const usersQuerySnapshot = await this.usersCollection.get();
      const usersData = usersQuerySnapshot.docs;

      const studentsProgressData: { firstName: string, lastName: string, email: string, progress: boolean, feedback: string }[] = [];

      for (const user of usersData) {
        for (const student of studentsProgress) {
          if (user.data().email === student.studentEmail) {
            const studentProgress = {
              firstName: user.data().firstName,
              lastName: user.data().lastName,
              email: user.data().email,
              progress: student.progress,
              feedback: student.feedback,
            };

            studentsProgressData.push(studentProgress);
          }
        }
      }
      
      await classRoomProgressRef.set({
        assignmentId: reference.id,
        classRoomId: classRoomDoc.id,
        studentsProgress: studentsProgressData,
      });
    }

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

  public async findAssignmentsByStudentEmail(studentEmail: string): Promise<AssignmentDto[]> {
    const classRoomsQuery = await this.classRoomCollection
      .where("studentEmails", "array-contains", studentEmail)
      .get();

    const assignments: AssignmentDto[] = [];

    for (const classRoomDoc of classRoomsQuery.docs) {
      const { assignmentIds } = classRoomDoc.data() as { assignmentIds: string[] };

      if (!assignmentIds || assignmentIds.length === 0) {
        continue;
      }

      for (const assignmentId of assignmentIds) {
        const assignmentDoc = await this.assignmentCollection.doc(assignmentId).get();

        if (assignmentDoc.exists) {
          assignments.push(new AssignmentDto({
            ...assignmentDoc.data(),
            id: assignmentDoc.id,
          }));
        }
      }
    }

    // return assignments where studentEmails contains this email

    return assignments;
  }

  public async updateAssignment(assignmentId: string, updateAssignmentDto: UpdateAssignmentDto) {
    const assignmentRoomRef = this.assignmentCollection.doc(assignmentId);

    await assignmentRoomRef.update({ ...updateAssignmentDto });
  }
}