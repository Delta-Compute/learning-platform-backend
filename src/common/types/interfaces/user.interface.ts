import { School } from "src/modules/auth/dto/auth-user-dto";

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  refreshToken: string;
  role?: string;
  password: string;
  school: School;
  natureLanguage?: string;
  foreignLanguage?: string;
}

export interface UserInfo {
  email: string;
  role: "teacher" | "student";
  firstName: string;
  lastName: string;
  school: School;
}