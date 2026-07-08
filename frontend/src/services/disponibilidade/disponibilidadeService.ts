import { api } from "@/api/axios";
import type {
  DisponibilidadePadraoRequest,
  DisponibilidadePadraoResponse,
} from "@/types/disponibilidade";

const BASE = "/disponibilidades-padrao";

export const disponibilidadeService = {
  listarPorMedico: async (idMedico: number) =>
    (
      await api.get<DisponibilidadePadraoResponse[]>(`${BASE}/medico/${idMedico}`)
    ).data,

  buscarPorId: async (id: number) =>
    (await api.get<DisponibilidadePadraoResponse>(`${BASE}/${id}`)).data,

  criar: async (dados: DisponibilidadePadraoRequest) =>
    (await api.post<DisponibilidadePadraoResponse>(BASE, dados)).data,

  atualizar: async (id: number, dados: DisponibilidadePadraoRequest) =>
    (await api.put<DisponibilidadePadraoResponse>(`${BASE}/${id}`, dados)).data,

  excluir: async (id: number) => await api.delete(`${BASE}/${id}`),
};
