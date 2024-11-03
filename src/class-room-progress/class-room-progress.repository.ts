import * as admin from "firebase-admin";

import { NotFoundException } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

@Injectable()
export class ClassRoomProgressRepository {
  private db: FirebaseFirestore.Firestore;
  private classRoomProgressCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.classRoomProgressCollection = this.db.collection("class-rooms-progress");
  }

  public async findClassRoomProgress(classRoomId: string, assignmentId: string) {
    const querySnapshot = await this.classRoomProgressCollection
      .where("classRoomId", "==", classRoomId)
      .where("assignmentId", "==", assignmentId)
      .limit(1) 
      .get();

    if (querySnapshot.empty) {
      throw new NotFoundException("Class room progress not found");
    }

    const classRoomProgressDoc = querySnapshot.docs[0];

     // every time get users and create studentsProgress !!!!! 

    return {
      id: classRoomProgressDoc.id,
      ...classRoomProgressDoc.data(),
    };
  }

  public async updateClassRoomProgress(classRoomId: string, assignmentId: string, studentEmail: string, feedback: string) {
    const querySnapshot = await this.classRoomProgressCollection
      .where("classRoomId", "==", classRoomId)
      .where("assignmentId", "==", assignmentId)
      .limit(1) 
      .get();

    if (querySnapshot.empty) {
      throw new NotFoundException("Class room progress document not found");
    }
  
    const classRoomProgressDoc = querySnapshot.docs[0];
    const studentsProgress = classRoomProgressDoc.data().studentsProgress || [];

    const updatedStudentsProgress = studentsProgress.map((student) => {
      if (student.email === studentEmail) {
        return {
          ...student,
          progress: true,        
          feedback: feedback,
        };
      }

      return student;
    });

    await classRoomProgressDoc.ref.update({
      studentsProgress: updatedStudentsProgress
    });
  
    return { message: "Student progress updated successfully" };
  }
} 