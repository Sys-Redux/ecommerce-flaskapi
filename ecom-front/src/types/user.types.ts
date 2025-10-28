export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user_id: number;
  name: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  address?: string;
  password?: string;
}
