import { api } from "@/api/axios";
import type {
  ExcecaoAgendaRequest,
  ExcecaoAgendaResponse,
} from "@/types/excecao";

const BASE = "/excecoes-agenda";

export const excecaoService = {
  listarPorMedico: async (idMedico: number) =>
    (await api.get<ExcecaoAgendaResponse[]>(`${BASE}/medico/${idMedico}`)).data,

  buscarPorId: async (id: number) =>
    (await api.get<ExcecaoAgendaResponse>(`${BASE}/${id}`)).data,

  criar: async (dados: ExcecaoAgendaRequest) =>
    (await api.post<ExcecaoAgendaResponse>(BASE, dados)).data,

  atualizar: async (id: number, dados: ExcecaoAgendaRequest) =>
    (await api.put<ExcecaoAgendaResponse>(`${BASE}/${id}`, dados)).data,

  excluir: async (id: number) => await api.delete(`${BASE}/${id}`),
};
