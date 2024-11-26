import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as nodemailer from "nodemailer";

const configService = new ConfigService();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configService.get("MAIL_HOST"),
      secure: true,
      port: 465,
      auth: {
        user: configService.get("MAIL_USER"), 
        pass: configService.get("MAIL_PASS")
      },
    });
  }

  async sendFile(to: string, name: string, file: Express.Multer.File): Promise<void> {
    try {
      const mailOptions = {
        from: "Teachers aid",
        to,
        subject: "Report from Teachers AI-d",
        text: `Dear ${name} Attached is your Teachers AI-d usage report. Best Regards`,
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ],
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
