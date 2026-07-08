import { api } from "@/api/axios";
import type { MedicoRequest, MedicoResponse } from "@/types/medico";

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
