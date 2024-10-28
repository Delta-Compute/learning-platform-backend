export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  refreshToken: string;
  role?: string;
  password: string;
}
