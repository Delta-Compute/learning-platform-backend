import { Controller, Param, Get } from "@nestjs/common";

import { GoogleSchoolSearchService } from "./google-school-search.service";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Google school search")
@Controller("google-school-search")
export class GoogleSchoolSearchController {
  constructor(private readonly googleSchoolSearchService: GoogleSchoolSearchService) {}

  @ApiOperation({ summary: "Find school from google" })
  @Get("/")
  async find(@Param("schoolName") schoolName: string) {
    return await this.googleSchoolSearchService.findSchool(schoolName);
  }
}