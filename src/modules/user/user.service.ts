import { Injectable, NotFoundException } from "@nestjs/common";

import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { School } from "../auth/dto/auth-user-dto";

@Injectable()
export class UserService {
  public constructor(public readonly userRepository: UserRepository) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  public async findUserByEmail(email: string, school: School) {
    return this.userRepository.findUserByEmail(email, school);
  }

  public async findUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  public async updateUserById(id: string, updates: UpdateUserDto) {
    const foundUser = await this.findUserById(id);

    if (!foundUser) {
      throw new NotFoundException("User not found");
    }

    return this.userRepository.updateById(id, updates);
  }

  public async deleteUserById(id: string) {
    const foundUser = await this.findUserById(id);

    if (!foundUser) {
      throw new NotFoundException("User not found");
    }

    return this.userRepository.deleteById(id);
  }
}