import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";

import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
import { AuthType } from "../user/dto/create-user.dto";

import { createHash } from "crypto";
import { SecretWords } from "src/common/types/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { email, password, school, auth } = signUpDto;

    const existingUser = await this.userService.findUserByEmail(email, school, auth); 

    if (existingUser) {
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

    const user = await this.userService.findUserByEmail(email, school, auth);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (auth === AuthType.Ai && secretWords !== undefined && !this.isWordsValid(secretWords, user.secretWords)) {
      throw new UnauthorizedException("Invalid words");
    }

    if (auth !== AuthType.Ai && !this.isPasswordValid(password, user.password)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
    });

    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);

    delete user.password;
    delete user.refreshToken;

    return {
      ...user,
      ...tokens,
    };
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