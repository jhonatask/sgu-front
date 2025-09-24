export interface LoginResponse {
  token: string;
  refreshToken?: string;
  name: string;
  email?: string;
  expiresIn?: number;
}