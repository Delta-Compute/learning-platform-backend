import * as admin from "firebase-admin";

import { NotFoundException } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

type StudentProgress = {
  assignmentTitle: string;
  assignmentTopic: string;
  assignmentDescription: string;
  email: string;
  firstName: string;
  lastName: string;
  progress: boolean;
  feedback: string;
};

@Injectable()
export class ClassRoomProgressRepository {
  private db: FirebaseFirestore.Firestore;
  private classRoomProgressCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private assignmentsCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.classRoomProgressCollection = this.db.collection("class-rooms-progress");
    this.assignmentsCollection = this.db.collection("assignments");
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

    // delete studentEmail from studentEmails field in assignments collection

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

  public async findClassRoomStudentsProgress(classRoomId: string, assignmentId: string): Promise<string> {
    const querySnapshot = await this.classRoomProgressCollection
      .where("classRoomId", "==", classRoomId)
      .where("assignmentId", "==", assignmentId)
      .limit(1)
      .get();

    const studentsProgress = querySnapshot.docs[0].data().studentsProgress;
    const assignmentProgress: StudentProgress[] = [];

    const assignmentQuerySnapshot = await this.assignmentsCollection
      .where(admin.firestore.FieldPath.documentId(), "==", assignmentId).get();

    const assignment = assignmentQuerySnapshot.docs[0].data();

    for (const student of studentsProgress) {
      const studentProgress = {
        assignmentTitle: assignment.title,
        assignmentTopic: assignment.topic,
        assignmentDescription: assignment.description,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        progress: student.progress,
        feedback: student.feedback,
      }

      assignmentProgress.push(studentProgress);
    }

    const classRoomProgress = assignmentProgress.map((progress, index) => {
      return `
        Student #${index + 1}
        Name: ${progress.firstName} ${progress.lastName}
        Email: ${progress.email}
        
        Assignment: ${progress.assignmentTitle}
        Topic: ${progress.assignmentTopic}
        Assignment description: ${progress.assignmentDescription}
        
        Progress: ${progress.progress ? "Finished" : "Not finished"}
        Feedback: ${progress.feedback || "No feedback"}

        --------------------------------------------
      `;
    }).join("\n"); 

    return classRoomProgress;
  }
} 