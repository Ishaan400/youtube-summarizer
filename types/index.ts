export interface User {
  id: string;
  email: string;
}

export interface Summary {
  _id: string;
  url: string;
  summary: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
