import * as admin from "firebase-admin";

import { Injectable, BadRequestException } from "@nestjs/common";

import { Bucket } from "@google-cloud/storage";

import axios from "axios";

@Injectable()
export class StorageService {
  private bucket: Bucket;

  constructor() {
    this.bucket = admin.storage().bucket();
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException("File not uploaded");
    }

    const { originalname } = file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + '-' + originalname;

    const blob = this.bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        reject(error);
      });

      blobStream.on("finish", () => {
        const url = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
        resolve(url);
      });

      blobStream.end(file.buffer);
    });
  }

  async uploadImageFromUrl(imageUrl: string): Promise<string> {
    if (!imageUrl) {
      throw new BadRequestException("No image URL provided");
    }

    try {
      // Download the image
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");

      // Generate a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${imageUrl.split('/').pop()}`;

      // Upload the image to Firebase Storage
      const blob = this.bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: response.headers["content-type"],
      });

      return new Promise((resolve, reject) => {
        blobStream.on("error", (error) => {
          reject(error);
        });

        blobStream.on("finish", () => {
          const url = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
          resolve(url);
        });

        blobStream.end(buffer);
      });
    } catch (error) {
      throw new BadRequestException("Failed to download or upload the image");
    }
  }
}
