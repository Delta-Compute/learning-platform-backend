import { Controller, Get, Query } from "@nestjs/common";
import { AppleAuthService } from "./apple-auth.service";

import { ApiTags } from "@nestjs/swagger";

@ApiTags("Apple auth")
@Controller("auth/apple")
export class AppleAuthController {
  constructor(private readonly appleAuthService: AppleAuthService) {}

  @Get("callback")
  async appleCallback(@Query("code") code: string) {
    try {
      const tokens = await this.appleAuthService.getTokens(code);

      const user = this.appleAuthService.decodeIdToken(tokens.id_token);

      return {
        email: user.email,
        name: user.name,
        tokens,
      };
    } catch (error) {
      throw new Error("Apple authentication failed");
    }
  }
}
