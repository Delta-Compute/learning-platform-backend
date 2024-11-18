import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

@Injectable()
export class GoogleSchoolSearchService {
  async findSchool(schoolName: string) {
    const configService = new ConfigService();
    const apiKey = configService.get("GOOGLE_API_KEY");

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
        params: {
          query: `Maple Bear school ${schoolName}`,
          key: apiKey,
        },
      });

      console.log(response.data);
    } catch (error) {
      
    }
  }
}