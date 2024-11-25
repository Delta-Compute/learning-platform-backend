import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { ClassRoomDto } from "./entities/class-room.entity";
import { UpdateClassRoomDto } from "./dto/update-class-room-dto";

import { v4 as uuid } from "uuid";

import { Report } from "src/common/types/interfaces/report.interface";
import { School } from "../auth/dto/auth-user-dto";

@Injectable()
export class ClassRoomRepository {
  private db: FirebaseFirestore.Firestore;
  private classRoomCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private assignmentsCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
  private classRoomsProgressCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.classRoomCollection = this.db.collection("class-rooms");
    this.assignmentsCollection = this.db.collection("assignments");
    this.classRoomsProgressCollection = this.db.collection("class-rooms-progress");
  }

  public async create(createClassDto: ClassRoomDto) {
    const reference = await this.classRoomCollection.add({
      ...createClassDto.toPlainObject(),
      verificationCode: uuid(),
    });
    const document = await reference.get();

    return {
      ...document.data(),
      id: document.id,
    };
  }

  public async update(classRoomId: string, updateClassRoomDto: UpdateClassRoomDto) {
    const { ...fieldsToUpdate } = updateClassRoomDto;

    if (!classRoomId) {
      throw new Error("classRoomId is required for updating");
    }

    const classRoomRef = this.classRoomCollection.doc(classRoomId);

    await classRoomRef.update(fieldsToUpdate);
  }

  public async findById(id: string): Promise<ClassRoomDto | null> {
    const reference = this.classRoomCollection.doc(id);
    const document = await reference.get();

    if (!document.exists) {
      return null;
    }
    
    const classRoom = new ClassRoomDto({
      ...document.data(),
      id: document.id,
    });

    return classRoom;
  }

  public async getAllByUserId(userId: string): Promise<ClassRoomDto[]> {
    if (!userId) {
      throw new Error("User ID must be provided and cannot be empty");
    }
  
    try {
      const snapshot = await this.classRoomCollection
        .where("teacherId", "==", userId)
        .get();
  
      if (snapshot.empty) {
        return [];
      }
  
      const classRooms: ClassRoomDto[] = snapshot.docs.map(doc => {
        return new ClassRoomDto({
          ...doc.data(),
          id: doc.id,
        });
      });
  
      return classRooms;
    } catch (error) {
      console.error("Error fetching classrooms by user ID:", error);
      throw new Error("Failed to fetch classrooms by user ID");
    }
  }

  public async addStudentEmail(verificationCode: string, email: string) {
    // TODO add condition for school type
    const document = await this.classRoomCollection
      .where("verificationCode", "==", verificationCode)
      .limit(1)
      .get();
    
    if (document.docs.length === 0) {
      throw new Error("Wrong verification code");
    } 

    const classRoom = document.docs[0].data();
    const classRoomId = document.docs[0].id;

    if (classRoom.studentEmails.includes(email)) {
      throw new Error("This email already added");
    } else {
      const studentEmails = [...classRoom.studentEmails];
      studentEmails.push(email);

      this.update(classRoomId, { studentEmails });
    }
  }

  public async getClassRoomReport(
    classRoomId: string, 
    studentEmails: string[], 
    rage: { from: number, to: number },
  ): Promise<Report[]> {
    const classRoomsProgressDocument = await this.classRoomsProgressCollection
      .where("classRoomId", "==", classRoomId)
      .get();

    const assignmentIds: string[] = [];

    for (const classRoomProgress of classRoomsProgressDocument.docs) {
      assignmentIds.push(classRoomProgress.data().assignmentId);
    }

    if (assignmentIds.length === 0) {
      return []; 
    }

    const assignmentsDocument = await this.assignmentsCollection
      .where(admin.firestore.FieldPath.documentId(), "in", assignmentIds)
      .get();

    const assignmentsInRange = [];

    console.log(assignmentsDocument);

    for (const assignment of assignmentsDocument.docs) {
      const createdAt = assignment.data().createdAt; 

      if (createdAt >= rage.from && createdAt <= rage.to) {
        assignmentsInRange.push({ assignmentId: assignment.id, ...assignment.data() });
      }
    }

    const assignmentIdsInRange = assignmentsInRange.map(item => item.assignmentId);

    const reports = [];

    for (const classRoomProgress of classRoomsProgressDocument.docs) {
      const assignmentId = classRoomProgress.data().assignmentId;

      if (!assignmentIdsInRange.includes(assignmentId)) {
        continue;
      }

      const assignmentData = assignmentsInRange.find(a => a.assignmentId === assignmentId);

      for (const studentProgressItem of classRoomProgress.data().studentsProgress) {
        if (!studentEmails.includes(studentProgressItem.email)) {
          continue;
        }

        let report = reports.find(r => r.studentEmail === studentProgressItem.email);

        if (!report) {
          report = {
            studentName: `${studentProgressItem.firstName} ${studentProgressItem.lastName}`,
            studentEmail: studentProgressItem.email,
            completedAssignments: [],
            inCompletedAssignments: [],
          };
          reports.push(report);
        }

        const assignmentWithFeedback = {
          ...assignmentData,
          feedback: studentProgressItem.feedback || "",
        };

        if (studentProgressItem.progress === true) {
          report.completedAssignments.push(assignmentWithFeedback);
        } else {
          report.inCompletedAssignments.push(assignmentWithFeedback);
        }
      }
    }

    return reports;
  }

  public async findForStudent(email: string, school: School): Promise<ClassRoomDto | null> {
    const document = await this.classRoomCollection.get();

    for (const classRoom of document.docs) {
      if (classRoom.data().studentEmails.includes(email)) {
        return new ClassRoomDto({ id: classRoom.id, ...classRoom.data() });
      }
    }

    return null;
  } 
} 