import { Get, Body, Param, Controller, Patch } from "@nestjs/common";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

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
}