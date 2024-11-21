import { School } from "src/modules/auth/dto/auth-user-dto";

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  refreshToken: string;
  role?: UserRole;
  password: string;
  school: School;
  natureLanguage?: string;
  foreignLanguage?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  school: School;
}