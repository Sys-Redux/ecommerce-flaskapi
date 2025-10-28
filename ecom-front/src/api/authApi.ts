import axiosInstance from './axiosConfig';
import type { User, RegisterData, LoginData, LoginResponse, UpdateUserData } from '../types/user.types';

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/users/me');
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
