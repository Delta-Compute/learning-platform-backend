import { 
  Module, 
  // MiddlewareConsumer 
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";

// import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ClassRoomModule } from "./modules/class-room/class-room.module"; 
import { AssignmentModule } from "./modules/assignment/assignment.module";
import { ClassRoomProgressModule } from "./modules/class-room-progress/class-room-progress.module";
import { GoogleSchoolSearchModule } from "./modules/google-school-search/google-school-search.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ClassRoomModule,
    AssignmentModule,
    ClassRoomProgressModule,
    GoogleSchoolSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       "users",
  //       // {
  //       //   path: "path to exclude",
  //       //   method: RequestMethod.POST,
  //       // },
  //     )
  //     .forRoutes("users");
  // }
}
