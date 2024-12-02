import { Module } from "@nestjs/common";

import { AppleAuthController } from "./apple-auth.controller";
import { AppleAuthService } from "./apple-auth.service";

@Module({
  controllers: [AppleAuthController],
  providers: [AppleAuthService],
})
export class AppleAuthModule {}