import { api } from "@/api/axios";

export interface MedicoRequest {
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  dataNascimento: string;
  ehAdministrador: number;
  numero: number;
  estado: string;
  especialidades: string[];
}

export interface MedicoResponse extends MedicoRequest {
  id: number;
}

export const medicoService = {
  listar: async () => (await api.get<MedicoResponse[]>("/medicos")).data,
  buscarPorId: async (id: number) =>
    (await api.get<MedicoResponse>(`/medicos/${id}`)).data,
  criar: async (dados: MedicoRequest) =>
    (await api.post<MedicoResponse>("/medicos", dados)).data,
  atualizar: async (id: number, dados: MedicoRequest) =>
    (await api.put<MedicoResponse>(`/medicos/${id}`, dados)).data,
  excluir: async (id: number) => await api.delete(`/medicos/${id}`),
};
