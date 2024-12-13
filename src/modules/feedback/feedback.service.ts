import { Injectable } from "@nestjs/common";

import { FeedbackRepository } from "./feedback.repository";

import { CreateFeedbackDto } from "./dto/create-feedback-dto";

@Injectable()
export class FeedbackService {
  public constructor(private readonly feedbackRepository: FeedbackRepository) {}

  public async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackRepository.create(createFeedbackDto);
  }
}