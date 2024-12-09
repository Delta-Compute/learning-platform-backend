import { School } from "src/modules/auth/dto/auth-user-dto";
import { AuthType } from "src/modules/user/dto/create-user.dto";

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
};

export interface SecretWords {
  color: string;
  number: string;
};

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  auth: AuthType;
  refreshToken: string;
  role?: UserRole;
  password: string;
  school: School;
  natureLanguage?: string;
  foreignLanguage?: string;
  schoolName?: string;
  secretWords?: SecretWords;
  userSummary?: string;
  resetCode?: string;
  resetCodeExpiresAt?: number;
};

export interface UserInfo {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  school: School;
};