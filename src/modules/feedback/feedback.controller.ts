import { Body, Post } from "@nestjs/common";

import { Controller } from "@nestjs/common";

import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback-dto";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Classroom feedback")
@Controller("class-room-feedback")
export class FeedbackController {
  public constructor (private readonly feedbackService: FeedbackService) {}

  @ApiOperation({ summary: "Create class room feedback" })
  @Post("/")
  public async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }
}