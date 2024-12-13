import { Controller, Post, Body, BadRequestException } from "@nestjs/common";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { LiveKitService } from "./livekit.service";

@ApiTags("Live Kit")
@Controller("livekit")
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) {}
  
  @ApiOperation({ summary: "Generate livekit token" })
  @Post("/generate-token")
  async generateToken(@Body() playgroundState: any) {
    try {
      return await this.liveKitService.createToken(playgroundState);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}