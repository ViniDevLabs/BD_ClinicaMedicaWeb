export type Role = "ADMINISTRADOR" | "MEDICO" | "ATENDENTE" | "PACIENTE";

export interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  perfis: Role[];
}
