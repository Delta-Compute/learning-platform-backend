import { 
  Get, 
  Body, 
  Param, 
  Controller, 
  Patch, 
  Query,
  BadRequestException,
} from "@nestjs/common";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { School } from "../auth/dto/auth-user-dto";
import { AuthType } from "./dto/create-user.dto";

@ApiTags("Users")
@Controller()
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Update user by id" })
  @Patch("/users/:id")
  public async updateById(@Param("id") id: string, @Body() userDto: UpdateUserDto) {
    return this.userService.updateUserById(id, userDto);
  }

  @ApiOperation({ summary: "Get user by id" })
  @Get("/users/:id")
  public async getById(@Param("id") id: string) {
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: "Get users by emails" })
  @ApiQuery({
    name: "email",
    type: String,
    isArray: true,
    description: "List of email addresses",
    required: true,
  })
  @Get("/users/find-users/find-all/:school")
  public async findUsersByEmailsList(
    @Param("school") school: School,
    @Query("email") emails: string | string[],
  ) {
    const emailsList = Array.isArray(emails) ? emails : [emails];

    if (emailsList.length === 0) {
      throw new BadRequestException("No emails provided");
    }

    return this.userService.findUserByEmailsList(emailsList, school);
  }

  @ApiOperation({ summary: "Find user by email" })
  @Get("/users/find-by-email/:email/:schoolName/:authType")
  public async findUserByEmail(
    @Param("email") email: string,
    @Param("schoolName") schoolName: School,
    @Param("authType") authType: AuthType,
  ) {
    const data = await this.userService.findUserByEmail(email, schoolName, authType);

    return data; 
  }
}