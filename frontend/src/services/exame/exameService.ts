import { api } from "@/api/axios";
import type { ExameRequest, ExameResponse } from "@/types/exame";

export const exameService = {
  listarPorAgendamento: async (idAgendamento: number) =>
    (await api.get<ExameResponse[]>(`/exames/agendamento/${idAgendamento}`))
      .data,

  criar: async (dados: ExameRequest) =>
    (await api.post<ExameResponse>("/exames", dados)).data,

  anexarLaudo: async (idExame: number, arquivoLaudoPath: string) =>
    (
      await api.patch<ExameResponse>(`/exames/${idExame}/anexar-laudo`, {
        arquivoLaudoPath,
      })
    ).data,

  concluir: async (idExame: number) =>
    (await api.patch<ExameResponse>(`/exames/${idExame}/concluir`)).data,
};
