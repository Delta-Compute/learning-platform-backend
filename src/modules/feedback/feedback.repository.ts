import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { CreateFeedbackDto } from "./dto/create-feedback-dto";

@Injectable()
export class FeedbackRepository {
  private db: FirebaseFirestore.Firestore;
  private collection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData
  >;

  public constructor() {
    this.db = admin.firestore();
    this.collection = this.db.collection("app-feedback");
  }

  public async create(createFeedbackDto: CreateFeedbackDto) {
    await this.collection.add({
      ...createFeedbackDto,
    });

    return { message: "Successfully added" };
  }
}