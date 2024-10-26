import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";

import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "./token.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    UserService, 
    UserRepository,
    TokenService,
  ],
  exports: [],
})

export class AuthModule {}