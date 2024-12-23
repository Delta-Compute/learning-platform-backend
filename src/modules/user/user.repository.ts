import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { User, UserInfo, UserRole } from "../../common/types/interfaces/user.interface";

import { AuthType, CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { instanceToPlain } from "class-transformer";
import { School } from "../auth/dto/auth-user-dto";

import { createHash } from "crypto"; 

@Injectable()
export class UserRepository {
  private db: FirebaseFirestore.Firestore;
  private userCollection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;
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
    this.userCollection = this.db.collection("users");
    this.classRoomCollection = this.db.collection("class-rooms");
    this.assignmentsCollection = this.db.collection("assignments");
    this.classRoomsProgressCollection = this.db.collection("class-rooms-progress");
  }

  public async create(createUserDto: CreateUserDto) {
    const reference = await this.userCollection.add(createUserDto);
    const document = await reference.get();

    return {
      ...document.data(),
      id: document.id,
    } as User;
  }

  public async findAll(): Promise<User[]> {
    const snapshot = await this.userCollection.get();
    const documents = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          foreignLanguage: doc.data().foreignLanguage ?? "",
          natureLanguage: doc.data().natureLanguage ?? "",
          auth: doc.data().auth,
          schoolName: doc.data().schoolName ?? "",
          userSummary: doc.data().userSummary ?? "",
        }) as unknown as User,
    );

    return documents;
  }
  
  public async findById(
    id: string,
  ): Promise<User | null> {
    const reference = this.userCollection.doc(id);
    const document = await reference.get();

    if (!document.exists) {
      return null;
    }

    return {
      id: document.id,
      email: document.data().email,
      auth: document.data().auth,
      firstName: document.data().firstName ?? "",
      lastName: document.data().lastName ?? "",
      role: document.data().role ?? "",
      foreignLanguage: document.data().foreignLanguage ?? "",
      natureLanguage: document.data().natureLanguage ?? "",
      school: document.data().school,
      schoolName: document.data().schoolName ?? "",
      secretWords: document.data().secretWords ?? null,
      userSummary: document.data().userSummary ?? "",
    } as User;
  }

  public async findUserByEmail(email: string, school: School, authType: AuthType): Promise<User[]> {
    const querySnapshot = await this.userCollection
      .where("email", "==", email)
      .where("school", "==", school)
      .where("auth", "==", authType)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return []; 
    }

    const document = querySnapshot.docs[0];

    return [
      {
        id: document.id,
        school: document.data().school,
        firstName: document.data().firstName,
        lastName: document.data().lastName,
        email: document.data().email,
        role: document.data().role,
        password: document.data().password,
        foreignLanguage: document.data().foreignLanguage ?? "",
        natureLanguage: document.data().natureLanguage ?? "",
        schoolName: document.data().schoolName ?? "",
        secretWords: document.data().secretWords ?? null,
        userSummary: document.data().userSummary ?? "",
        resetCode: document.data().resetCode ?? "",
        resetCodeExpiresAt: document.data().resetCodeExpiresAt ?? "",
      } as User
    ];
  }

  public async updateById(
    id: string,
    updates: Partial<UpdateUserDto>,
  ): Promise<User> {
    const reference = this.userCollection.doc(id);

    if (updates.secretWords) {
      updates.secretWords = this.hashWords(
        updates.secretWords.color,
        updates.secretWords.number,
      );
    }

    await reference.update(instanceToPlain(updates));

    const updatedDocument = await reference.get();

    return {
      ...updatedDocument.data(),
      id: updatedDocument.id,
    } as User;
  }

  public async delete(id: string): Promise<void> {
    const document = this.userCollection.doc(id);
    const user = (await document.get()).data();

    if (user.role === UserRole.Teacher) {
      // delete all class rooms
      const classRoomRef = await this.classRoomCollection
        .where("teacherId", "==", id)
        .get();
      
      for (const classRoom of classRoomRef.docs) {
        const classRoomDocument = this.classRoomCollection.doc(classRoom.id);

        // delete class room progress
        const classRoomProgressRef = await this.classRoomsProgressCollection
          .where("classRoomId", "==", classRoom.id)
          .get();

        for (const classRoomProgressItem of classRoomProgressRef.docs) {
          const classRoomProgressDocument = this.classRoomsProgressCollection.doc(classRoomProgressItem.id);
          await classRoomProgressDocument.delete();
        }  

        // delete assignments
        for (const assignmentId of classRoom.data().assignmentIds) {
          const assignmentDocument = this.assignmentsCollection.doc(assignmentId);
          await assignmentDocument.delete();
        }

        await classRoomDocument.delete();
      }
    }

    // delete user
    await document.delete();
  }

  public async getAllByEmails(emails: string[], school: School): Promise<UserInfo[]> {
    const reference = await this.userCollection
      .where("email", "in", emails)
      .where("role", "==", UserRole.Student)
      .where("school", "==", school)
      .get();

    const users = reference.docs.map(doc => ({
      id: doc.id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      email: doc.data().email,
      role: doc.data().role,
      school: doc.data().school,
      schoolName: doc.data().schoolName,
    }));

    return users as UserInfo[];
  }

  private hashField(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private hashWords = (color: string, number: string): { color: string, number: string } => {
    const hashedWords = {
      color,
      number,
    };

    hashedWords.color = this.hashField(hashedWords.color);
    hashedWords.number = this.hashField(hashedWords.number);

    return hashedWords;
  }
}