import { api } from "@/api/axios";
import type { PacienteResponse } from "@/types/paciente";

export interface CadastroPacienteRequest {
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  dataNascimento: string;
  ehAdministrador: number;
  convenio?: string;
  numCarteirinha?: string;
}

export const pacienteService = {
  async cadastrar(dados: CadastroPacienteRequest): Promise<void> {
    await api.post("/pacientes", dados);
  },

  listar: async () => (await api.get<PacienteResponse[]>("/pacientes")).data,

  buscarPorId: async (id: number) =>
    (await api.get<PacienteResponse>(`/pacientes/${id}`)).data,
};
