import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";

import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";

import { createHash } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { email, password, school } = signUpDto;

    const existingUser = await this.userService.findUserByEmail(email, school); 

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = this.hashPassword(password);

    const newUser = await this.userService.createUser({
      email,
      school,
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
    const { email, password, school } = signInDto;

    // and check school name
    const user = await this.userService.findUserByEmail(email, school);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!this.isPasswordValid(password, user.password)) {
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

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, hashedPassword: string): boolean {
    const hash = this.hashPassword(password);

    return hash === hashedPassword;
  }
}