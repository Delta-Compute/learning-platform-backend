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
  private collection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.collection = this.db.collection("users");
  }

  public async create(createUserDto: CreateUserDto) {
    const reference = await this.collection.add(createUserDto);
    const document = await reference.get();

    return {
      ...document.data(),
      id: document.id,
    } as User;
  }

  public async findAll(): Promise<User[]> {
    const snapshot = await this.collection.get();
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
    const reference = this.collection.doc(id);
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
    const querySnapshot = await this.collection
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
    const reference = this.collection.doc(id);

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

  public async deleteById(id: string): Promise<void> {
    const document = this.collection.doc(id);

    // delete all user data =>

    // delete classes
    // delete all class room progress with classes ids
    // delete all assignments
    

    await document.delete();
  }

  public async getAllByEmails(emails: string[], school: School): Promise<UserInfo[]> {
    const reference = await this.collection
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