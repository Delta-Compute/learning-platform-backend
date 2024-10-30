import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { ClassRoomDto } from "./entities/class-room.entity";

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
    const reference = await this.collection.add(createClassDto.toPlainObject());
    const document = await reference.get();

    return {
      ...document.data(),
      id: document.id,
    };
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

<<<<<<< HEAD
  public async getAllByUserId(userId: string): Promise<ClassRoomDto[]> {
    if (!userId) {
      throw new Error("User ID must be provided and cannot be empty");
    }
  
    try {
      const snapshot = await this.collection
        .where('teacherId', '==', userId)
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
=======
  public async findAll(): Promise<ClassRoomDto[]> {
    const snapshot = await this.collection.get();
  
    const classRooms = snapshot.docs.map((doc) => {
      return new ClassRoomDto({
        ...doc.data(),
        id: doc.id,
      });
    });

    return classRooms;
  }

  public async getAllByUserId(): Promise<any[]> {
    return [];
>>>>>>> 385ebe0b8b99d8dfe7fb266c10240ed3be0be5fc
  }
} 