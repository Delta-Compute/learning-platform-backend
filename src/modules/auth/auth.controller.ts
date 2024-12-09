import { Body, Controller, Post } from "@nestjs/common";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";

import { AuthService } from "./auth.service";
import { VerifyResetCodeDto } from "./dto/verify-reset-code-dto";
import { ResetCodeDto } from "./dto/reset-code-dto";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Sign in" })
  @Post("/sign-in")
  public async signIn(@Body() signInUserDto: SignInDto) {
    return this.authService.signIn(signInUserDto);
  }

  @ApiOperation({ summary: "Sign up" })
  @Post("/sign-up")
  public async signUp(@Body() signUpUserDto: SignUpDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @ApiOperation({ summary: "Send resend code" })
  @Post("/send-reset-code")
  public async sendResetCode(@Body() resetCodeDto: ResetCodeDto) {
    return this.authService.sendResetCode(resetCodeDto);
  }

  @ApiOperation({ summary: "Verify reset code" })
  @Post("/verify-reset-code")
  async verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(verifyResetCodeDto);
  }
}