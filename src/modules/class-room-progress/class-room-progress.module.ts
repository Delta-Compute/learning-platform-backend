import { Module } from "@nestjs/common";

import { ClassRoomProgressController } from "./class-room-progress.controller"; 
import { ClassRoomProgressService } from "./class-room-progress.service";
import { ClassRoomProgressRepository } from "./class-room-progress.repository";

@Module({
  imports: [],
  controllers: [ClassRoomProgressController],
  providers: [ClassRoomProgressService, ClassRoomProgressRepository],
  exports: [],
})

export class ClassRoomProgressModule {}