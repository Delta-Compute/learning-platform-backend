import { Module } from "@nestjs/common";

import { ClassRoomRepository } from "./class-room.repository";
import { ClassRoomController } from "./class-room.controller";
import { ClassRoomService } from "./class-room.service";
import { StorageService } from "../storage/storage.service";

@Module({
  imports: [],
  controllers: [ClassRoomController],
  providers: [ClassRoomRepository, ClassRoomService, StorageService],
  exports: [],
})

export class ClassRoomModule {}