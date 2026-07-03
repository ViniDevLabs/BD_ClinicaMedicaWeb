import { api } from '@/api/axios';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import type { Usuario } from '@/types/usuario';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async getMe(): Promise<Usuario> {
    const response = await api.get<Usuario>('/auth/me');
    return response.data;
  },
};