import { Module } from "@nestjs/common";

import { LiveKitController } from "./livekit.controller";
import { LiveKitService } from "./livekit.service";

@Module({
  controllers: [LiveKitController],
  providers: [LiveKitService],
})

export class LiveKitModule {}