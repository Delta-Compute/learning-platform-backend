import * as admin from "firebase-admin";

import { Injectable } from "@nestjs/common";

import { ClassRoomDto } from "./entities/class-room.entity";
import { CreateClassRoomDto } from "./dto/create-class-room-dto";
import { UpdateClassRoomDto } from "./dto/update-class-room-dto";

import { StorageService } from "../storage/storage.service";
import { ClassRoomRepository } from "./class-room.repository";

@Injectable()
export class ClassRoomService {
  public constructor(
    public readonly storageService: StorageService,
    public readonly classRoomRepository: ClassRoomRepository,
  ) {}

  async createClassRoom(createClassRoomDto: CreateClassRoomDto) {
    if (createClassRoomDto.file) {
      createClassRoomDto.logo = await this.storageService.uploadImage(
        createClassRoomDto.file,
      );
    }

    const classRoom = await this.classRoomRepository.create(
      new ClassRoomDto({
        ...createClassRoomDto,
        createdAt: new Date().getTime(),
      }),
    );

    return classRoom;
  }

  async findClassRoomById(id: string) {
    const classRoom = await this.classRoomRepository.findById(id);

    return classRoom;
  }

  async findClassesByTeacherId(teacherId: string) {
    const classRooms = await this.classRoomRepository.getAllByUserId(teacherId);

    return classRooms;
  }

  async updateClassRoom(classRoomId: string, updateClassRoomDto: UpdateClassRoomDto, file?: Express.Multer.File) {
    if (file) {
      updateClassRoomDto.logo = await this.storageService.uploadImage(file);
    }

    return await this.classRoomRepository.update(classRoomId, updateClassRoomDto);
  }
}