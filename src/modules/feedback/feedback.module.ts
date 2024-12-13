import { Module } from "@nestjs/common";

import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { FeedbackRepository } from "./feedback.repository";

@Module({
  providers: [FeedbackService, FeedbackRepository],
  controllers: [FeedbackController],
})
export class FeedbackModule {}