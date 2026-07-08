import { api } from "@/api/axios";
import type {
  CadastroPacienteRequest,
  PacienteResponse,
} from "@/types/paciente";

export const pacienteService = {
  async cadastrar(dados: CadastroPacienteRequest): Promise<void> {
    await api.post("/pacientes", dados);
  },

  listar: async () => (await api.get<PacienteResponse[]>("/pacientes")).data,

  buscarPorId: async (id: number) =>
    (await api.get<PacienteResponse>(`/pacientes/${id}`)).data,
};
