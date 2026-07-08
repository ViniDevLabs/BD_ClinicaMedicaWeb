import { api } from "@/api/axios";
import type { ExameResponse } from "@/types/exame";

export const exameService = {
  listarPorAgendamento: async (idAgendamento: number) =>
    (await api.get<ExameResponse[]>(`/exames/agendamento/${idAgendamento}`))
      .data,

  anexarLaudo: async (idExame: number, arquivoLaudoPath: string) =>
    (
      await api.patch<ExameResponse>(`/exames/${idExame}/anexar-laudo`, {
        arquivoLaudoPath,
      })
    ).data,
};
