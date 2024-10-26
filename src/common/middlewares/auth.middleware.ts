import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";

import { NextFunction, Request } from "express";
import { TokenService } from "../../modules/auth/token.service";
import { JwtPayload } from "../types/interfaces/jwt-payload.interface";
import { EXCEPTION } from "../constants/exception.constant";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  public async use(request: Request, _response: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(EXCEPTION.INVALID_TOKEN);
    }

    try {
      const payload: JwtPayload =
        await this.tokenService.validateAccessToken(token);

      // request.user = payload;

      next();
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}