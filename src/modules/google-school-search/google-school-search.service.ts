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
          query: schoolName,
          type: "school",
          key: apiKey,
        },
      });

      const schools = response.data.results.map((school) => ({
        placeId: school.place_id,
        name: school.name,
        address: school.formatted_address, 
        location: school.geometry.location, 
      }));

      return schools;
    } catch (error) {
      console.log(error);
      return "something went wrong";
    }
  }
}