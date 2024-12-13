import { IsString } from "class-validator"

export class CreateFeedbackDto {
  @IsString()
  userId: string;

  @IsString()
  satisfaction: string;

  @IsString()
  likedFeatures: string;

  @IsString()
  improvements: string;

  @IsString()
  missingFeatures: string;

  @IsString()
  recommendation: string;
}