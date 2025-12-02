export interface User {
  id: string | number;
  email: string;
  name?: string;
  [key: string]: unknown; // Allow additional user properties
}

export type Role = string | string[];

export interface AuthState {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  message?: string
}