import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { CreateClassRoomDto } from "./dto/create-class-room-dto";

import { StorageService } from "src/storage/storage.service";

@Injectable()
export class ClassRoomService {
  public constructor(
    public readonly storageService: StorageService,
  ) {}

  async createClassRoom(createClassRoomDto: CreateClassRoomDto) {
    if (createClassRoomDto.file) {
      createClassRoomDto.logo = await this.storageService.uploadImage(
        createClassRoomDto.file,
      );
    }
  }
}