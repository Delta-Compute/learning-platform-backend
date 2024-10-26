import { Module } from "@nestjs/common";

import { ClassRoomRepository } from "./class-room.repository";

@Module({
  imports: [],
  controllers: [],
  providers: [ClassRoomRepository],
  exports: [],
})

export class Class {}