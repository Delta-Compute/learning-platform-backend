import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { ClassRoomDto } from "./entities/class-room.entity";
import { UpdateClassRoomDto } from "./dto/update-class-room-dto";

import { v4 as uuid } from "uuid";

@Injectable()
export class ClassRoomRepository {
  private db: FirebaseFirestore.Firestore;
  private collection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.collection = this.db.collection("class-rooms");
  }

  public async create(createClassDto: ClassRoomDto) {
    const reference = await this.collection.add({
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

    const classRoomRef = this.collection.doc(classRoomId);

    await classRoomRef.update(fieldsToUpdate);
  }

  public async findById(id: string): Promise<ClassRoomDto | null> {
    const reference = this.collection.doc(id);
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
      const snapshot = await this.collection
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
    const document = await this.collection
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
} 