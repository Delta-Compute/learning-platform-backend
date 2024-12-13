import { ConfigService } from "@nestjs/config";

import { AccessToken } from "livekit-server-sdk";

const configService = new ConfigService();

export class LiveKitService {
  async createToken(playgroundState: any) {
   const {
      instructions,
      openaiAPIKey,
      sessionConfig: {
        turnDetection,
        modalities,
        voice,
        temperature,
        maxOutputTokens,
        vadThreshold,
        vadSilenceDurationMs,
        vadPrefixPaddingMs,
      }
    } = playgroundState;

    if (!openaiAPIKey) {
      throw new Error("OpenAI API key is required");
    }

    const roomName = Math.random().toString(36).slice(7);
    const apiKey = configService.get("LIVEKIT_API_KEY");
    const apiSecret = configService.get("LIVEKIT_API_SECRET");

    if (!apiKey || !apiSecret) {
      throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in configuration');
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: "human",
      metadata: JSON.stringify({
        instructions,
        modalities,
        voice,
        temperature,
        max_output_tokens: maxOutputTokens,
        openai_api_key: openaiAPIKey,
        turn_detection: JSON.stringify({
          type: turnDetection,
          threshold: vadThreshold,
          silence_duration_ms: vadSilenceDurationMs,
          prefix_padding_ms: vadPrefixPaddingMs,
        }),
      }),
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      canUpdateOwnMetadata: true,
    });

    return {
      accessToken: await at.toJwt(),
    };
  };
}