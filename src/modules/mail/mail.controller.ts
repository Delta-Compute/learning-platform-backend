import { Controller, Post, Body, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { MailService } from "./mail.service";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SendMailDto } from "./dto/send-mail-dto";

@ApiTags("Report mail")
@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: "Send report to gmail" })
  @UseInterceptors(FileInterceptor("file", {})) 
  @Post("send")
  async sendFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() sendMailDto: SendMailDto,
  ) {
    await this.mailService.sendFile(sendMailDto.email,  sendMailDto.name, file);
  }
}
