import { Injectable } from "@nestjs/common";

import axios from "axios";

import * as jwt from "jsonwebtoken";

@Injectable()
export class AppleAuthService {
  private readonly APPLE_TOKEN_URL = "https://appleid.apple.com/auth/token";

  private readonly TEAM_ID = ""; // Apple Developer Console
  private readonly CLIENT_ID = ""; // Services ID
  private readonly KEY_ID = ""; // Key ID з Apple
  private readonly PRIVATE_KEY = "";

  generateClientSecret(): string {
    const payload = {
      iss: this.TEAM_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: "https://appleid.apple.com",
      sub: this.CLIENT_ID,
    };

    return jwt.sign(payload, this.PRIVATE_KEY, {
      algorithm: "ES256",
      keyid: this.KEY_ID,
    });
  }

  async getTokens(code: string): Promise<any> {
    const clientSecret = this.generateClientSecret();

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: this.CLIENT_ID,
      client_secret: clientSecret,
    });

    const response = await axios.post(this.APPLE_TOKEN_URL, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  }

  decodeIdToken(idToken: string): any {
    const decoded = jwt.decode(idToken) as { email: string; name?: string };

    return decoded; 
  }
}
