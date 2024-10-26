import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageService } from "./storage.service";

@Controller("storage")
export class StorageController {
  constructor(private readonly srotageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(@UploadedFile() image) {
    return this.srotageService.uploadImage(image);
  }
}
