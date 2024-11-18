import { Module } from "@nestjs/common";

import { GoogleSchoolSearchService } from "./google-school-search.service";
import { GoogleSchoolSearchController } from "./google-school-search.controller";

@Module({
  imports: [],
  controllers: [GoogleSchoolSearchController],
  providers: [GoogleSchoolSearchService],
  exports: [],
})
export class GoogleSchoolSearchModule {}