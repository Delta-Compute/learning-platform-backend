import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { JwtPayload } from "../../common/types/interfaces/jwt-payload.interface";
import { CryptoUtil } from "../../common/utils/crypto.util";
import { UserService } from "../user/user.service";

@Injectable()
export class TokenService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  public async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get("ACCESS_JWT_SECRET"),
        expiresIn: "10d",
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get("REFRESH_JWT_SECRET"),
        expiresIn: "20d",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await CryptoUtil.encrypt(refreshToken);
    
    await this.userService.updateUserById(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async validateAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get("ACCESS_JWT_SECRET"),
    });
  }

  public async validateRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get("REFRESH_JWT_SECRET"),
    });
  }
}