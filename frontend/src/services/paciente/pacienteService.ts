import { api } from "@/api/axios";

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
};
