import { Body, Post } from "@nestjs/common";

import { Controller } from "@nestjs/common";

import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback-dto";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Application feedback")
@Controller("app-feedback")
export class FeedbackController {
  public constructor (private readonly feedbackService: FeedbackService) {}

  @ApiOperation({ summary: "Create application feedback" })
  @Post("/")
  public async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }
}