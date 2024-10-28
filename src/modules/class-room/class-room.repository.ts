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

  public async getAllByUserId(): Promise<any[]> {
    return [];
  }
} 