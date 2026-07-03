import type { Role } from './usuario';

export interface LoginRequest {
  cpf: string;
  senha?: string; 
}

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  perfis: Role[];
}