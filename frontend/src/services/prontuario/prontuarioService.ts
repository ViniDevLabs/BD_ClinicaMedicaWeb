import { api } from "@/api/axios";
import type { ProntuarioResponse } from "@/types/prontuario";

export interface ProntuarioRequest {
  idAgendamento: number;
  diagnostico?: string | null;
  prescricao?: string | null;
  registroObservacoes?: string | null;
}

export const prontuarioService = {
  /**
   * Retorna o prontuário do agendamento ou `null` quando ainda não existe (404).
   */
  buscarPorAgendamento: async (
    idAgendamento: number,
  ): Promise<ProntuarioResponse | null> => {
    try {
      const response = await api.get<ProntuarioResponse>(
        `/prontuarios/agendamento/${idAgendamento}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  criar: async (dados: ProntuarioRequest) =>
    (await api.post<ProntuarioResponse>("/prontuarios", dados)).data,

  atualizar: async (idProntuario: number, dados: ProntuarioRequest) =>
    (await api.put<ProntuarioResponse>(`/prontuarios/${idProntuario}`, dados))
      .data,
};
