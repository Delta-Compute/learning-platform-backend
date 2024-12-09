import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";

import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
import { AuthType } from "../user/dto/create-user.dto";
import { ResetCodeDto } from "./dto/reset-code-dto";
import { VerifyResetCodeDto } from "./dto/verify-reset-code-dto";

import { createHash } from "crypto";
import { SecretWords } from "src/common/types/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { email, password, school, auth } = signUpDto;

    const existingUser = await this.userService.findUserByEmail(email, school, auth); 

    if (existingUser.length > 0) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = this.hashField(password);

    const newUser = await this.userService.createUser({
      email,
      school,
      auth,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.generateTokens({
      sub: newUser.id,
    });

    await this.tokenService.updateRefreshToken(newUser.id, tokens.refreshToken);

    delete newUser.password;
    delete newUser.refreshToken;

    return {
      ...newUser,
      ...tokens,
    };
  }

  public async signIn(signInDto: SignInDto) {
    const { email, password, school, auth, secretWords } = signInDto;

    const users = await this.userService.findUserByEmail(email, school, auth);

    if (users.length === 0) {
      throw new NotFoundException("User not found");
    }

    if (auth === AuthType.Ai && secretWords !== undefined && !this.isWordsValid(secretWords, users[0].secretWords)) {
      throw new UnauthorizedException("Invalid words");
    }

    if (auth !== AuthType.Ai && !this.isPasswordValid(password, users[0].password)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.tokenService.generateTokens({
      sub: users[0].id,
    });

    await this.tokenService.updateRefreshToken(users[0].id, tokens.refreshToken);

    delete users[0].password;
    delete users[0].refreshToken;

    return {
      ...users[0],
      ...tokens,
    };
  }

  public async sendResetCode(resetCodeDto: ResetCodeDto) {
    const users = await this.userService.findUserByEmail(resetCodeDto.email, resetCodeDto.school, AuthType.Email); 
    if (users.length === 0) {
      throw new NotFoundException("User with this email does not exist or does not use email authorization");
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const resetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).getTime();

    await this.userService.updateUserById(users[0].id, { resetCode, resetCodeExpiresAt });

    await this.mailService.sendResetCode(users[0].email, resetCode);

    return { message: "Reset code sent successfully" };
  }

  public async verifyResetCode(verifyResetCodeDto: VerifyResetCodeDto) {
    const users = await this.userService.findUserByEmail(verifyResetCodeDto.email, verifyResetCodeDto.school, AuthType.Email); 

    if (users.length === 0) {
      throw new NotFoundException("User with this email does not exist or does not use email authorization");
    }

    if (verifyResetCodeDto.code !== users[0]?.resetCode) {
      throw new NotFoundException("Reset code is not correct"); 
    }

    if (users[0].resetCodeExpiresAt < new Date().getTime()) {
      throw new NotFoundException("Reset code has expired");
    }

    if (verifyResetCodeDto.code === users[0]?.resetCode && users[0].resetCodeExpiresAt > new Date().getTime()) {
      const hashedNewPassword = this.hashField(verifyResetCodeDto.newPassword);

      await this.userService.updateUserById(users[0].id, { password: hashedNewPassword });
    }

    return { message: "Password reset successfully" };
  }

  private hashField(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, hashedPassword: string): boolean {
    const hash = this.hashField(password);

    return hash === hashedPassword;
  }

  private hashWords = (color: string, number: string): { color: string, number: string } => {
    const hashedWords = {
      color,
      number,
    };

    hashedWords.color = this.hashField(hashedWords.color);
    hashedWords.number = this.hashField(hashedWords.number);

    return hashedWords;
  }

  private isWordsValid = (secretWords: SecretWords, hashedWords: SecretWords) => {
    const hash = this.hashWords(secretWords.color, secretWords.number);

    return hash.color === hashedWords.color && hash.number === hashedWords.number;
  }
}