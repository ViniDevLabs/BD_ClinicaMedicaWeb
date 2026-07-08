import { api } from "@/api/axios";
import type {
  AgendamentoRequest,
  AgendamentoResponse,
} from "@/types/agendamento";

export const agendamentoService = {
  listar: async () =>
    (await api.get<AgendamentoResponse[]>("/agendamentos")).data,

  listarPorPaciente: async (idPaciente: number) =>
    (
      await api.get<AgendamentoResponse[]>(
        `/agendamentos/paciente/${idPaciente}`,
      )
    ).data,

  listarPorMedico: async (idMedico: number) =>
    (await api.get<AgendamentoResponse[]>(`/agendamentos/medico/${idMedico}`))
      .data,

  buscarPorId: async (id: number) =>
    (await api.get<AgendamentoResponse>(`/agendamentos/${id}`)).data,

  listarHorariosDisponiveis: async (idMedico: number, dataIso: string) =>
    (
      await api.get<string[]>("/agendamentos/horarios-disponiveis", {
        params: { idMedico, data: dataIso },
      })
    ).data,

  criar: async (dados: AgendamentoRequest) =>
    (await api.post<AgendamentoResponse>("/agendamentos", dados)).data,

  cancelar: async (id: number) =>
    (await api.patch<AgendamentoResponse>(`/agendamentos/${id}/cancelar`)).data,

  confirmarCheckIn: async (id: number) =>
    (await api.patch<AgendamentoResponse>(`/agendamentos/${id}/confirmar`))
      .data,
  realizar: async (id: number) =>
    (await api.patch<AgendamentoResponse>(`/agendamentos/${id}/realizar`)).data,
};
