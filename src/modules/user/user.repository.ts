import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { User } from "../../common/types/interfaces/user.interface";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { instanceToPlain } from "class-transformer";

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
    } as User;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const querySnapshot = await this.collection
    .where("email", "==", email)
    .limit(1)
    .get();

    if (querySnapshot.empty) {
      return null; 
    }

    const document = querySnapshot.docs[0];

    return {
      id: document.id,
      firstName: document.data().firstName,
      lastName: document.data().lastName,
      email: document.data().email,
      role: document.data().role,
      password: document.data().password,
    } as User;
  }

  public async updateById(
    id: string,
    updates: Partial<UpdateUserDto>,
  ): Promise<User> {
    const reference = this.collection.doc(id);
    await reference.update(instanceToPlain(updates));

    const updatedDocument = await reference.get();

    return {
      ...updatedDocument.data(),
      id: updatedDocument.id,
    } as User;
  }

  public async deleteById(id: string): Promise<void> {
    const document = this.collection.doc(id);

    await document.delete();
  }
}